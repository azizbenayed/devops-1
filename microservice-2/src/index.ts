import express from "express";
import mongoose from "mongoose";

const app = express();

app.use(express.json());

// tes routes ici
// app.use("/api/users", ...);

app.get("/health", (req, res) => {
  res.send("OK");
});

/* ⬇️ SEULEMENT cette partie est remplacée */
const start = async () => {
  console.log("starting......");

  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined!");
  }

  try {

    if (process.env.NODE_ENV !== "test") {

      if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI must be defined!");
      }

      await mongoose.connect(process.env.MONGO_URI);
      console.log("Connected to MongoDb!");
    }

    app.listen(3000, "0.0.0.0", () => {
  console.log("Listening on port 3000!!!");
});


  } catch (err) {
    console.error(err);
  }
};

start();

