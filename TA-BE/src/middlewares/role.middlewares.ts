import { Request, Response, NextFunction } from "express";
import { roles } from "../role";
import { JwtPayload } from "../interfaces/jwt.interface";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const secretKey = process.env.JWT_SECRET as string;

export const checkPermission = (requiredPermissions: string[]) => {
  return (
    req: Request & { user?: JwtPayload },
    res: Response,
    next: NextFunction
  ): void => {
    try {
      const token = req.cookies?.token || req.cookies?.aToken;
      if (!token) {
        res.status(403).json({ message: "Role not found or invalid" });
        return;
      }

      try {
        const decoded = jwt.verify(token, secretKey) as JwtPayload;
        req.user = decoded;
      } catch (err) {
        res.status(400).json({ message: "Invalid token" });
        return;
      }

      const userRole = req.user?.role;
      if (!userRole) {
        res.status(403).json({ message: "Role not found or invalid" });
        return;
      }

      const userPermissions = roles[userRole];
      const hasPermission = requiredPermissions.every((permission) =>
        userPermissions.includes(permission)
      );

      if (!hasPermission) {
        res.status(403).json({ message: "Access denied" });
        return;
      }

      next();
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  };
};
