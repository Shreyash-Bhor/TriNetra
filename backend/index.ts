import express from "express";
import cors from "cors";
import connectDB from "./lib/db";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import cookieParser from "cookie-parser";
import refreshRoute from "./routes/refreshRoute";
import logoutRoute from "./routes/logoutRoute";
import lostPersonRoutes from "./routes/lostPersonRoutes";
dotenv.config();
const port = process.env.PORT;

const app = express();
app.use(cookieParser());

connectDB();

app.use(
  cors({
    origin: true,
  }),
);
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/auth", refreshRoute);
app.use("/api/auth", logoutRoute);
app.use("/api/lost-persons", lostPersonRoutes);
app.get("/", (req, res) => {
  res.send("Hii, I am Root!");
});

app.listen(port, () => {
  console.log("Server running on port 5000");
});
