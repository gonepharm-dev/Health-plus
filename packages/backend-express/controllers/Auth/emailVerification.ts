import type { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import AppError from "../../utils/AppError";
import DatabaseInstance from "../../middlewares/database";

dotenv.config();

export const EmailVerification = async (req: Request, res: Response, next: NextFunction) => {
  try {
      const { email } = req.body;

      if (!email) {
          return next(new AppError("Email is required", 400));
      }

      const newUser = await DatabaseInstance.collection('users').getFirstListItem(`email="${email}"`);
      
      if (!newUser) {
          return next(new AppError("This user does not exist", 404));
      }

      // Send verification email
      const verify = await DatabaseInstance.collection('users').requestVerification(newUser.email);

      res.status(200).json({
          status: "success",
          message: "Verification email sent",
          data: verify
      });

  } catch (error: any) {
      if (error?.status === 404) {
          return next(new AppError("User not found", 404));
      }
      if (error?.data?.code === "validation_invalid_email") {
          return next(new AppError("Invalid email format", 400));
      }
      console.error("Verification error:", error);
      return next(new AppError("Failed to send verification email", 500));
  }
};