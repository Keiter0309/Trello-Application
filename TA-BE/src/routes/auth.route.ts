import Router from "express";
import { AuthController } from "../controllers/auth.controller";
import { AuthServices } from "../services/auth.serivces";

const authRouter = Router();
const authService = new AuthServices();

authRouter.get("/", (req, res) => {
  res.send("Hello World");
});

authRouter.post("/register", new AuthController(authService).register);
authRouter.post("/login", new AuthController(authService).login);
authRouter.post("/logout", new AuthController(authService).logout);
authRouter.post(
  "/forgot-password",
  new AuthController(authService).forgotPassword
);

export default authRouter;
