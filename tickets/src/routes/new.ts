import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  requireAuth,
  validateRequest,
  NotAuthorizedError,
} from "@eftickets/common";
import { Ticket } from "../models/ticket";
import { TicketCreatedPublisher } from "../events/publishers/ticket-created-publisher";
import { rabbitWrapper } from "../rabbit-wrapper";

const router = express.Router();

router.post(
  "/api/tickets",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than 0"),
    body("quantity")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Quantity must be a whole number of at least 1"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    // Only admins are allowed to list tickets for sale. Regular clients
    // can browse and buy tickets, but cannot create/sell them.
    if ((req.currentUser as any)?.role !== "admin") {
      throw new NotAuthorizedError();
    }

    const { title, price } = req.body;
    // Default to 1 so older/simpler clients that don't send a quantity
    // keep getting the original "one ticket, one buyer" behavior.
    const quantity = req.body.quantity ? parseInt(req.body.quantity, 10) : 1;

    const ticket = Ticket.build({
      title,
      price,
      quantity,
      userId: req.currentUser!.id,
    });
    await ticket.save();
    // `quantity` isn't part of the published TicketCreatedEvent type yet
    // (that lives in the shared @eftickets/common package), so it's sent
    // as untyped extra data until that package's contract is updated.
    new TicketCreatedPublisher(rabbitWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
      quantity: ticket.quantity,
    } as any);

    res.status(201).send(ticket);
  }
);

export { router as createTicketRouter };
