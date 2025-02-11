import type { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import validator from "validator";
import AppError from "../../utils/AppError";
import DatabaseInstance from "../../middlewares/database";

dotenv.config();

// confirm password reset
export const ConfirmPasswordReset = async function (req: Request, res: Response, next: NextFunction) {
  try {
    const { token, password, newPassword } = req.body;

    if (!token) {
      return next(new AppError("Reset token is required", 400));
    }

    if (!password || !newPassword) {
      return next(new AppError("Both current and new passwords are required", 400));
    }

    // Ensure new password meets security requirements
    if (!validator.isStrongPassword(newPassword, { minLength: 8, minNumbers: 1, minUppercase: 1, minSymbols: 1 })) {
      return next(new AppError("New password must be at least 8 characters long and include a number, an uppercase letter, and a special character", 400));
    }

    // Ensure the new password is different from the old one
    if (password === newPassword) {
      return next(new AppError("New password must be different from the old password", 400));
    }

    const resetConfirmation = await DatabaseInstance.collection("users").confirmPasswordReset(token, password, newPassword);

    // Ensure the reset was successful
    if (!resetConfirmation) {
      return next(new AppError("Invalid or expired token", 400));
    }

    res.status(200).json({
      status: "success",
      message: "Password has been reset successfully",
      data: null
    });
  } catch (error: any) {
    return next(new AppError("Something went wrong, please try again", 500));
  }
};