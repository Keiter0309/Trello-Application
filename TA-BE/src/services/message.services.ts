import { isValidObjectId } from "mongoose";
import { JwtPayload } from "../interfaces/jwt.interface";
import Message from "../models/message.model";
import User from "../models/user.model";
import { Request, Response } from "express";

export class MessageServices {
  public async getUserForSidebar(
    req: Request & { user: JwtPayload },
    res: Response
  ): Promise<Response> {
    try {
      const loggedInUser = req.user.id;

      if (!isValidObjectId(loggedInUser)) {
        return res.status(400).json({
          status_code: 400,
          message: "Invalid user ID",
        });
      }

      const filteredUsers = await User.find({
        _id: { $ne: loggedInUser },
      }).select("-password").select("-confirmPasswd")

      if (filteredUsers.length === 0) {
        return res.status(200).json({
          status_code: 200,
          message: "No users found",
          data: [],
        });
      }

      return res.status(200).json({
        status_code: 200,
        message: "Users fetched successfully",
        data: filteredUsers,
      });
    } catch (error: any) {
      console.error(`Error in getUserForSidebar: ${error.message}`, error);
      return res.status(500).json({
        status_code: 500,
        message: "Error while fetching users",
        error: error.message,
      });
    }
  }

  public async getMessages(req: Request & { user: JwtPayload }, res: Response) {
    try {
      const { id } = req.params;
      const myId = req.user.id;

      const messages = await Message.find({
        $or: [
          { sender: myId, receiver: id },
          { sender: id, receiver: myId },
        ],
      })
        .populate("sender", "name")
        .populate("receiver", "name")
        .sort({ createdAt: 1 });

      return res.status(200).json(messages);
    } catch (error: any) {
      console.log(`Error in getMessages: ${error.message}`);
      return res.status(500).json("Error while fetching messages");
    }
  }

  public async sendMessage(req: Request & { user: JwtPayload }, res: Response) {
    try {
      const { id } = req.params;
      const { message } = req.body;
      const sender = req.user.id;

      const newMessage = new Message({
        sender,
        receiver: id,
        message,
      });

      await newMessage.save();

      return res.status(200).json({
        status_code: 200,
        message: "Message sent successfully",
      });
    } catch (error: any) {
      console.log(`Error in sendMessage: ${error.message}`);
      return res.status(500).json("Error while sending message");
    }
  }
}
