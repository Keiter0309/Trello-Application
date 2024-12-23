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
    role: { type: String, default: "user" },
    resetPasswordToken: { type: String, default: "" },
    resetTokenExpired: { type: String, default: "" },
    deletedAt: { type: Date, default: null },
    updatedBy: { type: String, default: "" },
    deletedBy: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

const User = model<IUser>("User", userSchema);
export default User;
