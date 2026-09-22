import mongoose from "mongoose";
import { app } from "./app";
import dotenv from "dotenv";
dotenv.config();


const RETRY_DELAY_MS = 3000;

const connectWithRetry = async (mongoUri: string) => {
  while (true) {
    try {
      await mongoose.connect(mongoUri);
      console.log("Connected to MongoDb!");
      return;
    } catch (err) {
      console.error(
        `MongoDB connection failed, retrying in ${RETRY_DELAY_MS}ms...`,
        err
      );
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
    }
  }
};

const start = async () => {
  console.log("starting......");
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined!");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined!");
  }

  // Keep retrying instead of giving up after one failed attempt, so a
  // MongoDB pod restarting during our own startup doesn't leave this
  // service permanently disconnected until someone manually restarts it.
  await connectWithRetry(process.env.MONGO_URI);

  mongoose.connection.on("disconnected", () => {
    console.error("Lost MongoDB connection, retrying...");
    connectWithRetry(process.env.MONGO_URI!);
  });

  app.listen(3000, "0.0.0.0", () => {
   console.log("Listening on port 3000!!!");
});
};

start();
