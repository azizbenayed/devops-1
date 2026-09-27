import { Consumer, OrderCreatedEvent, ExchangeNames } from "@eftickets/common";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCreatedListener extends Consumer<OrderCreatedEvent> {
  readonly exchangeName = ExchangeNames.OrderCreated;
  routingKey = "ordersKeyCreate";
  exchangeType = "direct";
  // Must be unique per service: services sharing a queue name compete for
  // its messages, so each event would reach only one of them.
  queueName = "ticketsOrderCreatedQueue";

  async onMessage(data: OrderCreatedEvent["data"]) {
    // Find the ticket that the order is reserving
    const ticket = await Ticket.findById(data.ticket.id);

    // If no ticket, throw error
    if (!ticket) {
      throw new Error("Ticket not found");
    }

    // Claim one unit of stock for this order. The orders service already
    // checked there was room before creating the order, so this just
    // records it here too (e.g. so the storefront listing hides the
    // ticket once every unit is spoken for).
    ticket.set({ reservedCount: ticket.reservedCount + 1 });

    // Save the ticket
    await ticket.save();
    await new TicketUpdatedPublisher(this.channel).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      version: ticket.version,
      quantity: ticket.quantity,
    } as any);
  }
}
