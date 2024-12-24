import { NextFunction, Request, Response } from "express";
import { LoginDto, RegisterDTO } from "../interfaces/auth.interface";
import User from "../models/User";
import * as argon from "argon2";
import {
  validateLogin,
  validateRegister,
} from "../validations/auth.validation";
import jwt from "jsonwebtoken";
import { clearCookies, cookies } from "../utils/cookie.utils";
import { JwtPayload } from "../interfaces/jwt.interface";
import dotenv from "dotenv";
import { sendMail } from "../utils/mail.utils";
import { SendMailTemplates } from "../constants/sendMails";
import { otp } from "../utils/otp.utils";
import { generateToken } from "../utils/jwt.utils";
dotenv.config();

export class AuthServices {
  public async register(req: Request, res: Response) {
    // Validate user input
    const { errors, isValid } = validateRegister(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    const { firstName, lastName, email, username, password, confirmPasswd } =
      req.body as RegisterDTO;

    try {
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res
          .status(401)
          .json({ message: "Email has already been registered" });
      }

      // Check if password and confirm password match
      if (password !== confirmPasswd) {
        return res.status(400).json({ message: "Password does not match" });
      }

      // Hash password
      const hashedPassword = await argon.hash(password);

      // Create new user
      const newUser = new User({
        firstName,
        lastName,
        email,
        username,
        password: hashedPassword,
        confirmPasswd: hashedPassword,
      });

      await newUser.save();

      return res.status(201).json({
        status_code: 201,
        message: "User created successfully",
        data: newUser,
      });
    } catch (err: any) {
      return res.status(500).json("Error while creating user");
    }
  }

  public async login(req: Request, res: Response, next: NextFunction) {
    const { errors, isValid } = validateLogin(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    const { email, password } = req.body as LoginDto;

    try {
      const existingUser = await User.findOne({ email });
      if (!existingUser) {
        return res.status(404).json("User not found");
      }

      const isValidPassword = await argon.verify(
        existingUser.password,
        password
      );

      if (!isValidPassword) {
        return res.status(400).json("Invalid password");
      }

      const payload = {
        id: existingUser.id,
        email: existingUser.email,
        role: existingUser.role,
      };

      const token = generateToken(payload);

      // Set cookies
      cookies(req, res, next, token);

      return res.status(200).json({
        status_code: 200,
        message: "Login successful",
        data: existingUser,
      });
    } catch (err: any) {
      return res.status(500).json(`Error while logging in: ${err.message}`);
    }
  }

  public async logout(req: Request, res: Response, next: NextFunction) {
    // Clear cookies
    clearCookies(req, res, next);

    return res.status(200).json({
      status_code: 200,
      message: "Logout successful",
    });
  }

  public async me(req: Request & { user: JwtPayload }, res: Response) {
    try {
      const user = await User.findById(req.user.id)
        .select("-password")
        .select("-confirmPasswd");
      return res.status(200).json({
        status_code: 200,
        message: "User fetched successfully",
        data: user,
      });
    } catch (err: any) {
      return res.status(500).json("Error while fetching user");
    }
  }

  public async changePassword(
    req: Request & { user: JwtPayload },
    res: Response
  ) {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json("User not found");
      }

      const isValidPassword = await argon.verify(
        user.password,
        currentPassword
      );
      if (!isValidPassword) {
        return res.status(400).json("Invalid password");
      }

      if (newPassword !== confirmNewPassword) {
        return res.status(400).json("Password does not match");
      }

      const hashedPassword = await argon.hash(newPassword);
      user.password = hashedPassword;
      await user.save();

      return res.status(200).json({
        status_code: 200,
        message: "Password changed successfully",
      });
    } catch (err: any) {
      return res.status(500).json("Error while changing password");
    }
  }

  public async forgotPassword(req: Request, res: Response) {
    const { email } = req.body;
    try {
      const existingUser = await User.findOne({ email });
      if (!existingUser) {
        return res.status(404).json({
          status_code: 404,
          message: "User not found",
        });
      }

      // Send email
      const otpCode = otp();
      const otpExpired = new Date(Date.now() + 60000).toISOString();

      // Save the otp to the user's data
      existingUser.resetPasswordToken = String(otpCode);
      existingUser.resetTokenExpired = otpExpired;

      await existingUser.save();

      // Send OTP to the email
      const mailOptions = SendMailTemplates.MAIL_FORGOT_PASSWORD(
        existingUser.firstName,
        otpCode
      );
      await sendMail(
        email,
        mailOptions.subject,
        mailOptions.text,
        mailOptions.html
      );

      return res.status(200).json({
        status_code: 200,
        message: "Email sent successfully",
      });
    } catch (err: any) {
      return res
        .status(500)
        .json(`Error while forgotting password ${err.message}`);
    }
  }

  public async resetPassword(req: Request, res: Response) {
    const { otp, newPasswd, confirmPasswd } = req.body;

    try {
      const existingUser = await User.findOne({
        resetPasswordToken: otp,
      });

      if (!existingUser) {
        return res.status(404).json({
          status_code: 404,
          message: "User not found",
        });
      }

      const tokenExpired = new Date(existingUser.resetTokenExpired!).getTime();
      const currentTime = new Date().getTime();

      if (currentTime > tokenExpired) {
        return res.status(400).json({
          status_code: 400,
          message: "OTP has expired",
        });
      }

      if (newPasswd !== confirmPasswd) {
        return res.status(400).json({
          status_code: 400,
          message: "Password does not match",
        });
      }

      const hashedPassword = await argon.hash(newPasswd);
      existingUser.password = hashedPassword;
      existingUser.resetPasswordToken = "";
      await existingUser.save();

      // Send email
      const mailOptions = SendMailTemplates.MAIL_RESET_PASSWORD(
        existingUser.firstName
      );
      await sendMail(
        existingUser.email,
        mailOptions.subject,
        mailOptions.text,
        mailOptions.html
      );

      return res.status(200).json({
        status_code: 200,
        message: "Password reset successfully",
      });
    } catch (err: any) {
      return res
        .status(500)
        .json(`Error while resetting password ${err.message}`);
    }
  }

  public async checkAuth(req: Request & { user: JwtPayload }, res: Response) {
    const user = await User.findById(req.user.id)
      .select("-password")
      .select("-confirmPasswd");
    return res.status(200).json({
      status_code: 200,
      message: "Authenticated",
      data: user,
    });
  }
}
