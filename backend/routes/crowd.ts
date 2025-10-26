import express from "express";
const app = express();

app.get("/crowd/info", (req, res) => {
  res.json({ location: "Nashik Kumbh Mela", crowdCount: 1000 });
});

app.post("/crowd/add", (req, res)=> {
  const { location, count } = req.body;
  res.json({ message: `Crowd data added for ${location}`, total: count });
});

export default app;
