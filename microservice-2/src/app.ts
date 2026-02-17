import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieParser from "cookie-parser";
import { errorHandler, NotFoundError } from "@eftickets/common";

import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(cookieParser());

// ✅ ROUTE HEALTH (AVANT app.all("*"))
app.get("/health", (req, res) => {
  res.status(200).send({
    status: "OK",
    service: "auth-service",
  });
});

// Routes métier
app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

// ❌ Catch-all TOUJOURS EN DERNIER
app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };

