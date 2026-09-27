import express, { Request, Response } from "express";
import {
  requireAuth,
  NotFoundError,
  NotAuthorizedError,
  BadRequestError,
} from "@eftickets/common";
import { Order, OrderStatus } from "../models/order";
import { OrderCancelledPublisher } from "../events/publishers/order-cancelled-publisher";
import { rabbitWrapper } from "../rabbit-wrapper";

const router = express.Router();

router.delete(
  "/api/orders/:orderId",
  requireAuth,
  async (req: Request, res: Response) => {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate("ticket");

    if (!order) {
      throw new NotFoundError();
    }
    // Admins manage every order, not just their own (they can't place
    // orders in the first place - see orders/routes/new.ts).
    const isAdmin = (req.currentUser as any)?.role === "admin";
    if (!isAdmin && order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    // A paid order needs a refund process, not a cancel button - and a
    // cancelled one has nothing left to cancel.
    if (order.status !== OrderStatus.Created && order.status !== OrderStatus.AwaitingPayment) {
      throw new BadRequestError("This order can no longer be cancelled");
    }
    order.status = OrderStatus.Cancelled;
    await order.save();

    // publishing an event saying this was cancelled!
    new OrderCancelledPublisher(rabbitWrapper.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });

    res.status(204).send(order);
  }
);

export { router as deleteOrderRouter };
