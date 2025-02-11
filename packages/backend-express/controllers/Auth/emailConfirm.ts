import type { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import AppError from "../../utils/AppError";
import DatabaseInstance from "../../middlewares/database";

dotenv.config();

export const ConfirmEmailVerification = async (req: Request, res: Response, next: NextFunction) => {
  try {
      const { token } = req.params;

      if (!token) {
          return next(new AppError("Email is required", 400));
      }

      // confirm email verification
      const verify = await DatabaseInstance.collection('users').confirmVerification(token);

      res.status(200).json({
          status: "success",
          message: "Email verified",
          data: verify
      });
  } catch (error: any) {
      if (error?.data?.code === "validation_invalid_email") {
          return next(new AppError("Invalid email format", 400));
      }
      console.error("Verification error:", error);
      return next(new AppError("Failed to send verification email", 500));
  }
};