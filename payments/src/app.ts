import express from "express";
import "express-async-errors";
import mongoose from "mongoose";
import { json } from "body-parser";
import cookieParser from "cookie-parser";
import {
  errorHandler,
  NotFoundError,
  isAuthenticated,
} from "@eftickets/common";
import { createChargeRouter } from "./routes/new";
import { verifyPaymentRouter } from "./routes/verify";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(cookieParser());

// Liveness: process is up and serving HTTP.
app.get("/healthz", (req, res) => {
  res.status(200).send("ok");
});

// Readiness: only report ready once Mongo is actually connected, so
// Kubernetes stops routing traffic to a pod stuck without a DB connection.
app.get("/readyz", (req, res) => {
  const isConnected = mongoose.connection.readyState === 1;
  res.status(isConnected ? 200 : 503).send(isConnected ? "ok" : "not ready");
});

app.use(isAuthenticated);
app.use(createChargeRouter);
app.use(verifyPaymentRouter);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
