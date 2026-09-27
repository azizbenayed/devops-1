import { rabbitWrapper } from "./rabbit-wrapper";
import { OrderCreatedListener } from "./events/listeners/order-created-listener";
import { expirationQueue } from "./queues/expiration-queue";
import dotenv from "dotenv";
dotenv.config();

const RETRY_DELAY_MS = 3000;

// Same idea as the other services: keep retrying instead of exiting on the
// first failed attempt. After a node reboot RabbitMQ is usually still
// starting when this pod boots, and exiting straight away just pushed the
// pod into CrashLoopBackOff with ever longer back-off delays.
const connectWithRetry = async (name: string, connect: () => Promise<unknown>) => {
  while (true) {
    try {
      await connect();
      console.log(`Connected to ${name}`);
      return;
    } catch (err) {
      console.error(
        `${name} connection failed, retrying in ${RETRY_DELAY_MS}ms...`,
        err
      );
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
    }
  }
};

const start = async () => {
  if (!process.env.RABBITMQ_URL) {
    throw new Error("RABBITMQ client must be defined");
  }
  if (!process.env.REDIS_HOST) {
    throw new Error("REDIS_HOST must be defined");
  }

  // Bull reconnects to Redis on its own, but only reports failures through
  // this event - without a listener a missing/unreachable Redis was silent
  // and orders simply never expired.
  expirationQueue.on("error", (err) => {
    console.error("Expiration queue (Redis) error:", err.message);
  });
  await connectWithRetry("Redis", () => expirationQueue.isReady());

  await connectWithRetry("RabbitMQ", () => rabbitWrapper.connect(process.env.RABBITMQ_URL!));

  rabbitWrapper.client.on("close", () => {
    console.log("RABBITMQ connection closed!");
    process.exit();
  });
  process.on("SIGINT", () => rabbitWrapper.client.close());
  process.on("SIGTERM", () => rabbitWrapper.client.close());

  new OrderCreatedListener(rabbitWrapper.client).consumeMessage();
};

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
