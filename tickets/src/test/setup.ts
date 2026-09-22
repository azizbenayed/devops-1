import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import { app } from "../app";
import jwt from "jsonwebtoken";

declare global {
  var signin: () => string[];
}

jest.mock("../rabbit-wrapper");

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = "asdfasdf";
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

  const mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  jest.clearAllMocks();
  if (mongoose.connection.db) {
    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
      await collection.deleteMany({});
    }
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

global.signin = () => {
  // Build a JWT payload. Defaults to admin because every existing test in
  // this service that hits POST/PUT /api/tickets already expects
  // global.signin() to be allowed to create/edit tickets (that route is
  // admin-only) - non-admin behavior is exercised separately where it
  // matters (e.g. the orders service's "admin can't buy" tests).
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: "test@test.com",
    role: "admin",
  };
  process.env.JWT_KEY = "asdfasdf";

  // Create the JWT!
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  return [`token=${token}`];
};
