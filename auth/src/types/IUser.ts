import mongoose from "mongoose";

export type UserRole = "admin" | "client";

// An interface that describes the properties
// that a User Document has
export interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
  role: UserRole;
}

export interface UserDocMethod extends UserDoc, mongoose.Document {
  getJwtToken: () => string;
}
