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
import { PaymentCreatedPublisher } from "../events/publishers/payment-created-publisher";
import { rabbitWrapper } from "../rabbit-wrapper";

const router = express.Router();

router.post(
  "/api/payments",
  requireAuth,
  [body("orderId").not().isEmpty().withMessage("OrderId is required")],
  validateRequest,
  async (req: Request, res: Response) => {
    console.log("PAYMENT BODY:", req.body);
    console.log("CURRENT USER:", req.currentUser);

    const { orderId } = req.body;

    const order = await Order.findById(orderId);

    console.log("FOUND ORDER:", order);

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError("Cannot pay for a cancelled order");
    }

    const amount = order.ticket.price * 100;

    console.log("CREATE STRIPE CHECKOUT SESSION:", {
      orderId,
      amount,
      ticketPrice: order.ticket.price,
    });

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
      success_url: "http://nodeapp.local:32560/payment/success",
      cancel_url: "http://nodeapp.local:32560/payment/cancel",
    });

    console.log("STRIPE SESSION CREATED:", session.id);

    const payment = Payment.build({
      orderId,
      stripeId: session.id,
    });

    await payment.save();

    await new PaymentCreatedPublisher(rabbitWrapper.client).publish({
      id: payment.id,
      orderId: payment.orderId,
      stripeId: payment.stripeId,
    });

    res.status(201).send({ url: session.url });
  }
);

export { router as createChargeRouter };
