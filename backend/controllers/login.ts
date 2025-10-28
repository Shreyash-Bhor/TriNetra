import express from "express";
import bcrypt from "bcrypt";
import { loginUserSchema } from "../schemas/loginUserSchema";
import { UserModel } from "../models/User";

export const loginApp = async (req: express.Request, res: express.Response) => {
  try {
    const data = loginUserSchema.parse(req.body);
    const { email, password } = data;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return Response.json({ message: "Invalid email" }, { status: 401 });
    }
    const pass = await bcrypt.compare(password, user.password);
    if (!pass) {
      return Response.json({ message: "Invalid Password" }, { status: 401 });
    }
  } catch (error: any) {
    return Response.json({ message: error.message }, { status: 500 });
  }
};
