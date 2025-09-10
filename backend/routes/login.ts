import express from "express";
const app = express();

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (email === "admin@example.com" && password === "123456") {
    res.json({ success: true, message: "Login successful", token: "fake-jwt-token" });
  } else {
    res.json({ success: false, message: "Invalid credentials" });
  }
});

export default app;
