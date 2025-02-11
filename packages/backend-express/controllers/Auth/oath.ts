import type { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import validator from "validator";
import AppError from "../../utils/AppError";
import DatabaseInstance from "../../middlewares/database";

dotenv.config();

// Login with google
export const OAuth2 = async function (req: Request, res: Response, next: NextFunction) {
  try {
    const { provider = "google", code, redirectURL } = req.body;

    // Validate redirectURL format
    if (!validator.isURL(redirectURL, { require_protocol: true })) {
      return next(new AppError("Invalid redirect URL format", 400));
    }

    // Authenticate using OAuth2 with PocketBase
    const authData = await DatabaseInstance.collection('users').authWithOAuth2({
      provider,
      code,
      redirectURL: process.env.GOOGLE_REDIRECT_URL,
    });

    // Ensure authentication was successful
    if (!authData) {
      return next(new AppError("OAuth authentication failed", 401));
    }

    res.status(200).json({
      status: "success",
      message: "OAuth authentication successful",
      data: authData
    });
  } catch (error: any) {
    console.error("OAuth2 authentication error:", error);
    return next(new AppError("Something went wrong during authentication", 500));
  }
}