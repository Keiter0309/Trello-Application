import { model, Schema } from "mongoose";
import { IUser } from "../interfaces/auth.interface";
const userSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    confirmPasswd: { type: String, required: true },
    role: { type: String },
  },
  {
    timestamps: true,
  }
);

const User = model<IUser>("User", userSchema);
export default User;
