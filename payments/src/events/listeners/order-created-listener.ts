import { Consumer, OrderCreatedEvent, ExchangeNames } from "@eftickets/common";
import { Order } from "../../models/order";

export class OrderCreatedListener extends Consumer<OrderCreatedEvent> {
  readonly exchangeName = ExchangeNames.OrderCreated;
  routingKey = "ordersKeyCreate";
  exchangeType = "direct";
  // Must be unique per service: services sharing a queue name compete for
  // its messages, so each event would reach only one of them.
  queueName = "paymentsOrderCreatedQueue";

  async onMessage(data: OrderCreatedEvent["data"]) {
    const order = Order.build({
      id: data.id,
      price: data.ticket.price,
      status: data.status,
      userId: data.userId,
      version: data.version,
    });
    await order.save();

    // msg.ack();
  }
}
