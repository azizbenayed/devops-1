import express from "express";
import "express-async-errors";
import mongoose from "mongoose";
import { json } from "body-parser";
import cookieParser from "cookie-parser";
import { errorHandler, NotFoundError } from "@eftickets/common";

import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";

const app = express();

// Required when running behind ingress/nginx proxy
app.set("trust proxy", true);

app.use(json());

// Required so req.cookies.session can be read in current-user middleware/routes
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

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
