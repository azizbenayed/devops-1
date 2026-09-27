import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  validateRequest,
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
  requireAuth,
} from "@eftickets/common";
import { stripe } from "../stripe";
import { Order } from "../models/order";
import { Payment } from "../models/payment";

const router = express.Router();

router.post(
  "/api/payments",
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

    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError("Cannot pay for a cancelled order");
    }

    const amount = order.price * 100;

    // Configurable so this isn't stuck pointing at one environment, but
    // falls back to the current known-good URL if unset.
    const clientUrl = process.env.CLIENT_URL || "http://nodeapp.local:32560";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Ticket",
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      // Carry the orderId through so the success/cancel pages can show
      // the client which order this was for instead of a blank screen.
      success_url: `${clientUrl}/payment/success?orderId=${orderId}`,
      cancel_url: `${clientUrl}/payment/cancel?orderId=${orderId}`,
    });

    // Only records that a checkout session was started - the order isn't
    // marked paid yet. That only happens once the client lands back on
    // the success page and /api/payments/verify confirms with Stripe that
    // the card actually went through (see routes/verify.ts). Firing
    // PaymentCreated here, before the buyer has even entered card
    // details, used to mark orders "complete" whether or not they ever
    // paid.
    const payment = Payment.build({
      orderId,
      stripeId: session.id,
    });

    await payment.save();

    res.status(201).send({ url: session.url });
  }
);

export { router as createChargeRouter };
