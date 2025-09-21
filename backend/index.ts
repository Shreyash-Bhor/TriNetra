import express from "express";
import cors from "cors";
import crowdApp from "./routes/crowd";
import loginApp from "./routes/login";
import signupApp from "./routes/signup";
import connectDB from "./lib/db";
import dotenv from "dotenv";

dotenv.config();
const port = process.env.PORT;

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use(crowdApp);
app.use(loginApp);
app.use(signupApp);

app.get("/", (req, res) => {
  res.send("Hii, I am Root!");
});

app.listen(port, () => {
  console.log("Server running on port 5000");
});
