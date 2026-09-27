import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  validateRequest,
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
} from "@eftickets/common";
import { stripe } from "../stripe";
import { Order } from "../models/order";
import { Payment } from "../models/payment";
import { rabbitWrapper } from "../rabbit-wrapper";
import { PaymentCreatedPublisher } from "../events/publishers/payment-created-publisher";

const router = express.Router();

// Called by the client's payment-success page. Starting a Stripe checkout
// session doesn't mean the buyer actually paid - Stripe only knows that
// once they've entered a card and submitted. This asks Stripe directly
// whether the session that brought the buyer back here was actually paid,
// and only then marks the order complete (via the same PaymentCreated
// event the old code used to fire the moment the session was created).
router.post(
  "/api/payments/verify",
  requireAuth,
  [body("orderId").not().isEmpty().withMessage("OrderId is required")],
  validateRequest,
  async (req: Request, res: Response) => {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    // A buyer can cancel and retry a checkout, so there may be several
    // Payment records for one order - the most recent attempt is the one
    // that matters.
    const payment = await Payment.findOne({ orderId }).sort({ _id: -1 });
    if (!payment) {
      return res.send({ paid: false });
    }

    if (payment.confirmed) {
      return res.send({ paid: true });
    }

    const session = await stripe.checkout.sessions.retrieve(payment.stripeId);

    if (session.payment_status !== "paid") {
      return res.send({ paid: false });
    }

    payment.set({ confirmed: true });
    await payment.save();

    await new PaymentCreatedPublisher(rabbitWrapper.client).publish({
      id: payment.id,
      orderId: payment.orderId,
      stripeId: payment.stripeId,
    });

    res.send({ paid: true });
  }
);

export { router as verifyPaymentRouter };
