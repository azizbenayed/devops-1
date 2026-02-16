const start = async () => {
  console.log("starting......");

  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined!");
  }

  try {
    if (process.env.NODE_ENV !== "test") {
      await mongoose.connect(process.env.MONGO_URI!);
      console.log("Connected to MongoDb!");
    }

    app.listen(3000, () => {
      console.log("Listening on port 3000!!!");
    });

  } catch (err) {
    console.error(err);
  }
};

start();
