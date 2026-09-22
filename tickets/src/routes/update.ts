import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  validateRequest,
  NotFoundError,
  requireAuth,
  NotAuthorizedError,
  BadRequestError,
} from "@eftickets/common";
import { Ticket } from "../models/ticket";
import { TicketUpdatedPublisher } from "../events/publishers/ticket-updated-publisher";
import { rabbitWrapper } from "../rabbit-wrapper";

const router = express.Router();

router.put(
  "/api/tickets/:id",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be provided and must be greater than 0"),
    body("quantity")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Quantity must be a whole number of at least 1"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    // Only admins can edit tickets for sale.
    if ((req.currentUser as any)?.role !== "admin") {
      throw new NotAuthorizedError();
    }

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      throw new NotFoundError();
    }

    if (ticket.reservedCount > 0) {
      throw new BadRequestError("Cannot edit a ticket that already has orders on it");
    }

    if (ticket.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    const quantity = req.body.quantity
      ? parseInt(req.body.quantity, 10)
      : ticket.quantity;

    ticket.set({
      title: req.body.title,
      price: req.body.price,
      quantity,
    });
    await ticket.save();
    // See new.ts for why `quantity` is cast through as extra untyped data.
    new TicketUpdatedPublisher(rabbitWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
      quantity: ticket.quantity,
    } as any);

    res.send(ticket);
  }
);

export { router as updateTicketRouter };
