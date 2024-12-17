import { Request, Response, NextFunction } from "express";
export const cookies = (req: Request, res: Response, next: NextFunction, token: string) => {
  res.cookie("token", token, {
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
  });
  next();
};
