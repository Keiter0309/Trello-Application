import { Request, Response, NextFunction } from "express";
import { roles } from "../role";
import { JwtPayload } from "../interfaces/jwt.interface";
export const checkPermission = (requiredPermissions: string[]) => {
  return (
    req: Request & { user?: JwtPayload },
    res: Response,
    next: NextFunction
  ): void => {
    try {
      const userRole = req.user?.role;
      if (!userRole || !roles[userRole]) {
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
