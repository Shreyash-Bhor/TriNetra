import express from "express";
const app = express();

app.get("/login", (req, res) => {
  res.send("This is Login Route");
});
app.post("/login", (req, res) => {
  res.send("This is Login route");
});

export default app;
