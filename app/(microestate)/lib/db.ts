import mongoose from "mongoose";

if (!process.env.MICRO_MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MICRO_MONGODB_URI"');
}

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("Already Connected To Database");
    return;
  }
  try {
    const db = await mongoose.connect(process.env.MICRO_MONGODB_URI || "");
    // extracting data
    connection.isConnected = db.connections[0].readyState;
    console.log("Db connected Sucessfully");
  } catch (error) {
    console.error("Error while Connecting to database Monogodb", error);
    process.exit(1);
  }
}

export default dbConnect;
