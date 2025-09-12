import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  const MONGODB_URI = process.env.MONGODB_URI as string;

  if (!MONGODB_URI) {
    console.error("MONGODB_URI not found in environment variables");
    process.exit(1);
  }
  try {
    const connectionInstance = await mongoose.connect(MONGODB_URI, {
      maxPoolSize: 5,
      serverSelectionTimeoutMS: 5000,
    });
    console.log(
      "MONGODB connected successfully !! DB HOST ",
      connectionInstance.connection.host
    );
  } catch (error) {
    console.error("MONGO_DB connection error: ", error);
    process.exit(1);
  }
};

export default connectDB;
