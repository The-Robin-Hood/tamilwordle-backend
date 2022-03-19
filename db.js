import mongoose from "mongoose";

const connection = {};

async function dbConnect() {
  if (connection.isAlive) {
    return;
  }
  const db = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  connection.isAlive = db.connections[0].readyState;
  console.log("Connected to MongoDB", connection.isAlive);
}

export default dbConnect;
