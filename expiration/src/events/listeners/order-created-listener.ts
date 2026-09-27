import { Consumer, OrderCreatedEvent, ExchangeNames } from "@eftickets/common";
import { expirationQueue } from "../../queues/expiration-queue";

export class OrderCreatedListener extends Consumer<OrderCreatedEvent> {
  readonly exchangeName = ExchangeNames.OrderCreated;
  routingKey = "ordersKeyCreate";
  exchangeType = "direct";
  // Must be unique per service: services sharing a queue name compete for
  // its messages, so each event would reach only one of them.
  queueName = "expirationOrderCreatedQueue";

  async onMessage(data: OrderCreatedEvent["data"]) {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
    console.log("Waiting this many milliseconds to process the job:", delay);

    await expirationQueue.add(
      {
        orderId: data.id,
      },
      {
        delay,
      }
    );
  }
}
