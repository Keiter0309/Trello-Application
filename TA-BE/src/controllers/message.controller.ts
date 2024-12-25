import { JwtPayload } from "../interfaces/jwt.interface";
import { Request, Response } from "express";
import User from "../models/user.model";
import { MessageServices } from "../services/message.services";

export class MessageController {
  constructor(private messageService: MessageServices) {
    this.messageService = messageService;
  }

  public getUserForSidebar = async (req: Request, res: Response) => {
    try {
      await this.messageService.getUserForSidebar(
        req as Request & { user: JwtPayload },
        res
      );
    } catch (error) {
      console.error(error);
    }
  };

  public getMessages = async (req: Request, res: Response) => {
    try {
      await this.messageService.getMessages(
        req as Request & { user: JwtPayload },
        res
      );
    } catch (error) {
      console.error(error);
    }
  };

  public sendMessage = async (req: Request, res: Response) => {
    try {
      await this.messageService.sendMessage(
        req as Request & { user: JwtPayload },
        res
      );
    } catch (error) {
      console.error(error);
    }
  };
}
