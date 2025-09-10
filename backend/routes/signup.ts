import express from "express";
const app = express();

app.post("/signup", (req, res) => {
  const { name, email } = req.body;
  res.json({ success: true, message: `User ${name} registered with email ${email}` });
});

export default app;
