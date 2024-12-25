import { Router } from "express";

import { MessageController } from "../controllers/message.controller";
import { MessageServices } from "../services/message.services";
import { authenticateToken } from "../middlewares/auth.middlewares";
import { EMessage } from "../enums/message.enums";

const messageRouter = Router();

const messageServices = new MessageServices();
const messageController = new MessageController(messageServices);

messageRouter.get(
  EMessage.GET_USERS,
  authenticateToken,
  messageController.getUserForSidebar
);
messageRouter.get(
  EMessage.GET_MESSAGES,
  authenticateToken,
  messageController.getMessages
);
messageRouter.post(
  EMessage.SEND_MESSAGE,
  authenticateToken,
  messageController.sendMessage
);

export default messageRouter;
