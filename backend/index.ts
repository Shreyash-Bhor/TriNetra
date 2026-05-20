import express from "express";
import cors from "cors";
import connectDB from "./lib/db";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import cookieParser from "cookie-parser";
import refreshRoute from "./routes/refreshRoute";
import logoutRoute from "./routes/logoutRoute";
import lostPersonRoutes from "./routes/lostPersonRoutes";
import alertRoutes from "./routes/alertRoutes";
import crowdRoutes from "./routes/crowdRoutes";
import { cameraFeedSimulatorService } from "./services/cameraFeedSimulatorService";
dotenv.config();
const port = process.env.PORT;

const app = express();
app.use(cookieParser());

connectDB();

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);
app.use(express.json({ limit: "15mb" }));
app.use("/api/auth", authRoutes);
app.use("/api/auth", refreshRoute);
app.use("/api/auth", logoutRoute);
app.use("/api/lost-persons", lostPersonRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/crowd", crowdRoutes);
app.get("/", (_req, res) => {
  res.send("Hii, I am Root!");
});
app.use(
  (
    error: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error("Unhandled API error", error);

    const statusCode = error.message.includes("too large") ? 413 : 500;

    res.status(statusCode).json({
      message:
        statusCode === 500
          ? "Internal server error"
          : "Request payload is too large.",
    });
  },
);
app.listen(port, async () => {
  try {
    await cameraFeedSimulatorService.start();
  } catch (error) {
    console.error("Failed to bootstrap camera feed simulation", error);
  }

  console.log("Server running on port 5000");
});