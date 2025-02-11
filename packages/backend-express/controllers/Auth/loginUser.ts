import type { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import AppError from "../../utils/AppError";
import DatabaseInstance from "../../middlewares/database";

dotenv.config();

// login user
export const LoginUser = async function (req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
  
      if (!email || !password) {
        return next(new AppError("Email and password are required", 400));
      }

      // get user from the database
      const currentUser = await DatabaseInstance.collection('users').getFirstListItem(`email="${email}"`);

      if(!currentUser){
        return next(new AppError("User not found", 404))
      }

      if(!currentUser.active){
        return next(new AppError("You must activate your account", 402))
      }
  
      const authData = await DatabaseInstance.collection('users').authWithPassword(email, password);
  
      res.status(200).json({
        status: "success",
        token: authData.token,
        record: authData.record
      });
  
    } catch (error: any) {
      // Handle 403 (authentication requirements failed)
      if (error?.status === 403) {
        return next(new AppError(`Invalid credentials or unverified email`, 403));
      }

      if (error?.status === 404) {
        return next(new AppError("User not found", 404));
      }
      return next(new AppError("Login failed", 500));
    }
  };
