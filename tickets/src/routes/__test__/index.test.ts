import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";

const createTicket = () => {
  return request(app).post("/api/tickets").set("Cookie", global.signin()).send({
    title: "asldkf",
    price: 20,
  });
};

it("can fetch a list of tickets", async () => {
  await createTicket();
  await createTicket();
  await createTicket();

  const response = await request(app).get("/api/tickets").send().expect(200);

  expect(response.body.length).toEqual(3);
});

it("still lists tickets created before stock existed (no quantity/reservedCount stored)", async () => {
  // Insert straight into the collection to bypass the schema defaults,
  // like a ticket that was saved before these fields were introduced.
  const legacyId = new mongoose.Types.ObjectId();
  await Ticket.collection.insertOne({
    _id: legacyId,
    title: "legacy",
    price: 10,
    userId: "someone",
    version: 0,
  });

  const response = await request(app).get("/api/tickets").send().expect(200);

  expect(response.body.map((t: any) => t.id)).toContain(legacyId.toHexString());
});

it("hides a ticket once every unit is reserved, but keeps a partially reserved one visible", async () => {
  const { body: soldOut } = await createTicket(); // quantity 1
  const { body: multiUnit } = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({ title: "multi", price: 20, quantity: 2 });

  await Ticket.findByIdAndUpdate(soldOut.id, { reservedCount: 1 }); // fully booked
  await Ticket.findByIdAndUpdate(multiUnit.id, { reservedCount: 1 }); // 1 of 2 left

  const response = await request(app).get("/api/tickets").send().expect(200);

  const ids = response.body.map((t: any) => t.id);
  expect(ids).not.toContain(soldOut.id);
  expect(ids).toContain(multiUnit.id);
});
