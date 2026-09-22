import { Consumer, TicketCreatedEvent, ExchangeNames } from "@eftickets/common";
import { Ticket } from "../../models/ticket";

export class TicketCreatedListener extends Consumer<TicketCreatedEvent> {
  readonly exchangeName = ExchangeNames.TicketCreated;
  routingKey = "ticketsKeyCreate";
  exchangeType = "direct";
  queueName = "ticketsCreateQueue";

  async onMessage(data: TicketCreatedEvent["data"]) {
    const { id, title, price } = data;
    // `quantity` isn't in the shared TicketCreatedEvent type yet, so it
    // travels as untyped extra data - see tickets/src/routes/new.ts.
    const quantity = (data as any).quantity;

    const ticket = Ticket.build({
      id,
      title,
      price,
      quantity,
    });
    await ticket.save();
  }
}
