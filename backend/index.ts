import express from "express";
import cors from "cors";

import crowdApp from "./routes/crowd";
import loginApp from "./routes/login";
import signupApp from "./routes/signup";

const app = express();
app.use(cors());
app.use(express.json());

// Use routes from separate files
app.use(crowdApp);
app.use(loginApp);
app.use(signupApp);

app.get("/", (req, res) => {
    res.send("Hii, I am Root!");
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});
