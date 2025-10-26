import express from "express";
import brcypt from "bcrypt";
import {registerUserSchema} from "../schemas/registerUserSchema";
import {UserModel} from "../models/User";
const app = express();

export const loginApp = async(req: Request, res: Response)=>{
  try{
      const data = registerUserSchema.parse(req.body);
      const {username, email, password, firstName, lastName, phone, role} = data;
      const user_mail = await UserModel.findOne({email});
      if(user_mail){
        return Response.json({message:"Mail Already exist"}, {status:401});
      }
      const hashedpass = await brcypt.hash(password, 10);
      const user_mod = new UserModel({username, email, password:hashedpass, firstName, lastName, phone, role});
      await user_mod.save();

      return Response.json({message: }, {status:});
  }
  catch(error:any)
  {
    Response.json({message:error.message},{status:})
  }
}

app.get("/signup", (req, res) => {
  res.send("This is sign Up route");
});

export default app;
