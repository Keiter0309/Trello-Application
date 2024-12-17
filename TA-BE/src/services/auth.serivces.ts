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

      const token = jwt.sign(
        {
          id: existingUser._id,
          email: existingUser.email,
          role: existingUser.role,
        },
        process.env.JWT_SECRET!,
        { expiresIn: "1h" }
      );

      // Set cookies
      cookies(req, res, next, token);

      return res.status(200).json({
        status_code: 200,
        message: "Login successful",
        data: existingUser,
      });
    } catch (err: any) {
      return res.status(500).json("Error while logging in");
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
      const user = await User.findById(req.user.id).select("-password");
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
}
