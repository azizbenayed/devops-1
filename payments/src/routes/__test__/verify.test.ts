import mongoose from "mongoose";
import request from "supertest";
import { OrderStatus } from "@eftickets/common";
import { app } from "../../app";
import { Order } from "../../models/order";
import { Payment } from "../../models/payment";
import { stripe } from "../../stripe";
import { rabbitWrapper } from "../../rabbit-wrapper";

async function createCheckoutSession() {
  return stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: { name: "test ticket" },
          unit_amount: 2000,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: "https://example.com/success",
    cancel_url: "https://example.com/cancel",
  });
}

it("returns a 404 if the order does not exist", async () => {
  await request(app)
    .post("/api/payments/verify")
    .set("Cookie", global.signin())
    .send({ orderId: new mongoose.Types.ObjectId().toHexString() })
    .expect(404);
});

it("returns a 401 if the order doesn't belong to the caller", async () => {
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 20,
    status: OrderStatus.Created,
  });
  await order.save();

  await request(app)
    .post("/api/payments/verify")
    .set("Cookie", global.signin())
    .send({ orderId: order.id })
    .expect(401);
});

it("reports unpaid when there's no payment attempt on record", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price: 20,
    status: OrderStatus.Created,
  });
  await order.save();

  const { body } = await request(app)
    .post("/api/payments/verify")
    .set("Cookie", global.signin(userId))
    .send({ orderId: order.id })
    .expect(200);

  expect(body.paid).toEqual(false);
});

it("reports unpaid and doesn't publish PaymentCreated for a checkout session that was never paid", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price: 20,
    status: OrderStatus.Created,
  });
  await order.save();

  const session = await createCheckoutSession();
  await Payment.build({ orderId: order.id, stripeId: session.id }).save();

  const { body } = await request(app)
    .post("/api/payments/verify")
    .set("Cookie", global.signin(userId))
    .send({ orderId: order.id })
    .expect(200);

  expect(body.paid).toEqual(false);
  expect(rabbitWrapper.client.publish).not.toHaveBeenCalled();

  const payment = await Payment.findOne({ orderId: order.id });
  expect(payment!.confirmed).toEqual(false);
});

it("doesn't re-check with Stripe (or re-publish) once a payment is already confirmed", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price: 20,
    status: OrderStatus.Created,
  });
  await order.save();
  await Payment.build({ orderId: order.id, stripeId: "sess_already_confirmed" }).save();
  await Payment.findOneAndUpdate({ orderId: order.id }, { confirmed: true });

  const { body } = await request(app)
    .post("/api/payments/verify")
    .set("Cookie", global.signin(userId))
    .send({ orderId: order.id })
    .expect(200);

  expect(body.paid).toEqual(true);
  expect(rabbitWrapper.client.publish).not.toHaveBeenCalled();
});
