import { NextFunction, Request, Response } from "express";
import { AuthServices } from "../services/auth.serivces";
import { JwtPayload } from "../interfaces/jwt.interface";

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

  public logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.authService.logout(req, res, next);
    } catch (error) {
      console.error(error);
    }
  };

  public changePassword = async (req: Request, res: Response) => {
    try {
    } catch (err: any) {
      await this.authService.changePassword(
        req as Request & { user: JwtPayload },
        res
      );
      console.error(err);
    }
  };

  public forgotPassword = async (req: Request, res: Response) => {
    try {
      await this.authService.forgotPassword(req, res);
    } catch (error) {
      console.error(error);
    }
  };

  public resetPassword = async (req: Request, res: Response) => {
    try {
      await this.authService.resetPassword(req, res);
    } catch (error) {
      console.error(error);
    }
  };

  public me = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.authService.me(req as Request & { user: JwtPayload }, res);
    } catch (error) {
      console.error(error);
    }
  };
}
