import mongoose from "mongoose";
import { app } from "./app";
import { rabbitWrapper } from "./rabbit-wrapper";
import { OrderCreatedListener } from "./events/listeners/order-created-listener";
import { OrderCancelledListener } from "./events/listeners/order-cancelled-listener";

const RETRY_DELAY_MS = 3000;

// Keep retrying instead of giving up after one failed attempt: if MongoDB
// or RabbitMQ is still starting (or restarting) when this pod boots, we'd
// otherwise log the error once and serve HTTP with no connection at all,
// leaving every request that touches the DB failing until someone
// manually restarts the pod.
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
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }
  if (!process.env.RABBITMQ_URL) {
    throw new Error("RABBITMQ client must be defined");
  }

  // Database first, so the event listeners started below never receive a
  // message before there's a DB to write it to.
  await connectWithRetry("MongoDb", () => mongoose.connect(process.env.MONGO_URI!));
  await connectWithRetry("RabbitMQ", () => rabbitWrapper.connect(process.env.RABBITMQ_URL!));

  rabbitWrapper.client.on("close", () => {
    console.log("RABBITMQ connection closed!");
    process.exit();
  });
  process.on("SIGINT", () => rabbitWrapper.client.close());
  process.on("SIGTERM", () => rabbitWrapper.client.close());

  new OrderCreatedListener(rabbitWrapper.client).consumeMessage();
  new OrderCancelledListener(rabbitWrapper.client).consumeMessage();

  app.listen(3000, "0.0.0.0", () => {
    console.log("Listening on port 3000!!!");
  });
};

start();
