import express, { Request, Response } from "express";
import { Ticket } from "../models/ticket";

const router = express.Router();

router.get("/api/tickets", async (req: Request, res: Response) => {
  // Only list tickets that still have at least one unsold unit - a sold
  // out ticket (reservedCount === quantity) shouldn't show up in the
  // storefront, same as the old "hide once reserved" behavior, just
  // stock-aware now that a ticket can have more than one unit.
  const tickets = await Ticket.find({
    $expr: { $lt: ["$reservedCount", "$quantity"] },
  });

  res.send(tickets);
});

export { router as indexTicketRouter };
