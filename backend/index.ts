import express from "express";
import cors from "cors";
import connectDB from "./lib/db";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes";
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

connectDB();

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/demo", demoRoutes);
app.use("/api/get-started", getStartedRoutes);
app.use("/api/contact-sales", contactSalesRoutes);
app.use("/api/crowd", crowdRoutes);
app.use("/api/alert", alertRoutes);
app.use("/api/dashboard", dashboardRoute);
app.use("/api/infrastructure", infraRoutes);
app.use("/api/social", socialRoutes);

app.get("/", (req, res) => {
  res.send("Hii, I am Root!");
});

app.listen(port, () => {
  console.log("Server running on port 5000");
});
