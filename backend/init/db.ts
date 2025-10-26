import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const uri = process.env.MONGODB_URI!;

export async function connectDB() {
  try {
    await mongoose.connect(uri);
    console.log("Database Connection successfull");
  } catch (error) {
    console.error("Error Connecting to Database");
    process.exit(1);
  }
}
