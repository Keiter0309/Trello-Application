import Router from "express";
import { AuthController } from "../controllers/auth.controller";
import { AuthServices } from "../services/auth.serivces";
import { authenticateToken } from "../middlewares/auth.middlewares";
import { EAuth } from "../enums/auth.enums";
import { checkPermission } from "../middlewares/role.middlewares";

const authRouter = Router();
const authService = new AuthServices();
const authController = new AuthController(authService);

authRouter.get("/", (req, res) => {
  res.send("Hello World");
});

authRouter.post(EAuth.REGISTER, authController.register);
authRouter.post(EAuth.LOGIN, authController.login);
authRouter.post(EAuth.LOGOUT, authenticateToken, authController.logout);
authRouter.post(
  EAuth.CHANGE_PASSWORD,
  authenticateToken,
  authController.changePassword
);
authRouter.post(EAuth.RESET_PASSWORD, authController.resetPassword);
authRouter.post(EAuth.FORGOT_PASSWORD, authController.forgotPassword);
authRouter.get(EAuth.GET_ME, authenticateToken, authController.me);
authRouter.get("/view", checkPermission(["read"]), (req, res) => {
  res.send("You can view this content.");
});

export default authRouter;
