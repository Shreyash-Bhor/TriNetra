import express from "express";
const app = express();

app.get("/signup", (req, res) => {
  res.send("This is sign Up route");
});

export default app;
