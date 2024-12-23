import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { JwtPayload } from "../interfaces/jwt.interface";
dotenv.config();

export const generateToken = (payload: JwtPayload) => {
  const token = jwt.sign(
    {
      id: payload.id,
      email: payload.email,
      role: payload.role,
    },
    process.env.JWT_SECRET!,
    { expiresIn: "1h" }
  );

  return token;
};
