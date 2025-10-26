import express from "express";
import { email } from "zod";
const app = express();
const router = express.Router();
/*
const loginApp = (req, res, next) => {
  let user_id = req.body.username;
  let Pass_num = req.body.password;
  if(user_id === email && Pass_num === password)
    
}
*/
// Middleware
const loginMiddleware = (req, res, next) => {
  
    // Body se ek object bana liya
    const userInput = 
    {
      email: req.body.username,
      password: req.body.password,
    };
    const cheque = userInput.email === email && userInput.password === password;
   
    if (!cheque) 
    {
      return res.status(401).send('Access denied. No token provided.');
    }
    try
    {
      next();
    } 
   catch (error) 
  {
    
    return res.status(500).json({ message: "Something went wrong", error });
  }
};

app.get("/login", (req, res) => {
  res.send("This is Login Route");
});

export default app;
