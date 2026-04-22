/*
import express from "express";
import cors from "cors";
import connectDB from "./lib/db";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
dotenv.config();
const port = 5000; 

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
*/

import express from "express";
import cors from "cors";
import connectDB from "./lib/db";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";

dotenv.config();

const port = 5000;
const app = express();

connectDB();

app.use(
  cors({
    origin: "http://localhost:3000", // or 192.168.10.4
    credentials: true
  })
);

app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Hii, I am Root!");
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});

