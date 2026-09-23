import express, { Request, Response } from "express";
import { Ticket } from "../models/ticket";

const router = express.Router();

router.get("/api/tickets", async (req: Request, res: Response) => {
  // Only list tickets that still have at least one unsold unit - a sold
  // out ticket (reservedCount === quantity) shouldn't show up in the
  // storefront, same as the old "hide once reserved" behavior, just
  // stock-aware now that a ticket can have more than one unit.
  //
  // Tickets created before stock existed have neither field stored in
  // MongoDB (the schema defaults only apply once a document is loaded,
  // not to this query), so treat missing values as "1 unit, 0 reserved" -
  // otherwise every pre-existing ticket would vanish from the storefront.
  const tickets = await Ticket.find({
    $expr: {
      $lt: [
        { $ifNull: ["$reservedCount", 0] },
        { $ifNull: ["$quantity", 1] },
      ],
    },
  });

  res.send(tickets);
});

export { router as indexTicketRouter };
