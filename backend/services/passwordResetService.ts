import bcrypt from "bcrypt";
import { UserModel } from "../models/User";

export async function resetPasswordByUsername(
  username: string,
  newPassword: string,
): Promise<boolean> {
  const user = await UserModel.findOne({ username: username.trim() });

  if (!user) {
    return false;
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save();

  return true;
}
