import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./lib/db";

// Routes
import authRoutes from "./routes/authRoutes";
import refreshRoute from "./routes/refreshRoute";
import logoutRoute from "./routes/logoutRoute";
import demoRoutes from "./routes/demoRoutes";
import getStartedRoutes from "./routes/getStartedRoutes";
import contactSalesRoutes from "./routes/contactSalesRoutes";
import crowdRoutes from "./routes/crowdRoutes";
import alertRoutes from "./routes/alertRoutes";
import dashboardRoute from "./routes/dashboardRoute";
import infraRoutes from "./routes/infraRoutes";
import socialRoutes from "./routes/socialRoutes";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// DB
connectDB();

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/auth", refreshRoute);
app.use("/api/auth", logoutRoute);

app.use("/api/demo", demoRoutes);
app.use("/api/get-started", getStartedRoutes);
app.use("/api/contact-sales", contactSalesRoutes);
app.use("/api/crowd", crowdRoutes);
app.use("/api/alert", alertRoutes);
app.use("/api/dashboard", dashboardRoute);
app.use("/api/infrastructure", infraRoutes);
app.use("/api/social", socialRoutes);

// Root
app.get("/", (req, res) => {
  res.send("Hii, I am Root!");
});

// Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
