import express from "express";
import bcrypt from "bcrypt";
import { registerUserSchema } from "../schemas/registerUserSchema";
import { UserModel } from "../models/User";

export const signupApp = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const data = registerUserSchema.parse(req.body);
    const { username, email, password, firstName, lastName, phone, role } =
      data;
    const user_mail = await UserModel.findOne({ email });
    if (user_mail) {
      return Response.json({ message: "Mail Already exist" }, { status: 401 });
    }
    const hashedpass = await bcrypt.hash(password, 10);
    const user_mod = new UserModel({
      username,
      email,
      password: hashedpass,
      firstName,
      lastName,
      phone,
      role,
    });
    await user_mod.save();

    return Response.json(
      { message: "User saved successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return Response.json({ message: error.message }, { status: 500 });
  }
};
