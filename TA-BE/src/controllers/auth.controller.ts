import { NextFunction, Request, Response } from "express";
import { AuthServices } from "../services/auth.serivces";

export class AuthController {
  constructor(private authService: AuthServices) {
    this.authService = authService;
  }

  public register = async (req: Request, res: Response) => {
    try {
      await this.authService.register(req, res);
    } catch (error) {
      console.error(error);
    }
  };

  public login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.authService.login(req, res, next);
    } catch (error) {
      console.error(error);
    }
  };
}
