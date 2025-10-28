import express from "express";
import cors from "cors";
import connectDB from "./lib/db";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
dotenv.config();
const port = process.env.PORT;

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.get("/", (req, res) => {
  res.send("Hii, I am Root!");
});

app.listen(port, () => {
  console.log("Server running on port 5000");
});
