import type { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import AppError from "../../utils/AppError";
import DatabaseInstance from "../../middlewares/database";

dotenv.config();

// Password reset
export const PasswordReset = async function (req: Request, res: Response, next: NextFunction) {
  try {
    const { email } = req.body;

    if (!email) {
      return next(new AppError("Email is required", 400));
    }

    // Request password reset
    const sendToken = await DatabaseInstance.collection("users").requestPasswordReset(email);

    // Ensure the token was generated successfully
    if (!sendToken) {
      return next(new AppError("Failed to send password reset email", 500));
    }

    res.status(200).json({
      status: "success",
      message: "Password reset email sent successfully",
      data: sendToken
    });
  } catch (error: any) {
    return next(new AppError("Something went wrong, please try again", 500));
  }
};
