import type { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import AppError from "../../utils/AppError";
import DatabaseInstance from "../../middlewares/database";

dotenv.config();
export const CreateUser = async function (req: Request, res: Response, next: NextFunction) {
  try {
      const { username, email, password, confirmPassword, role, active = true, contact_number, specialization, full_name } = req.body;

      if (!username || !email || !password || !confirmPassword) {
          return next(new AppError("username, email, password, and confirmPassword are required", 400));
      }

      if (password !== confirmPassword) {
          return next(new AppError("password and confirmPassword do not match", 400));
      }

      // Set default role to "patient" if not provided
      const userRole = role || "patient";

      // Validate role
      const allowedRoles = ["admin", "patient", "doctor"];

      if (!allowedRoles.includes(userRole)) {
          return next(new AppError(`Invalid role.`, 400));
      }

      const data: any = {
          username,
          full_name,
          email,
          emailVisibility: true,
          password: password,
          passwordConfirm: password,
          role: userRole,
          active,
          contact_number,
      };

      // Add specialization only if the role is "doctor"
      if (userRole === "doctor") {
          if (!specialization) {
              return next(new AppError("Specialization is required for Doctor role.", 400));
          }
          data.specialization = specialization;
      }

      const newUser = await DatabaseInstance.collection("users").create(data);

      // Respond with success
      res.status(201).json({
          status: "success",
          data: newUser,
      });
  } catch (error: any) {
      // Handle PocketBase validation errors
      if (error?.data?.data) {
          const errors = error.data.data;
          let errorMessage = "Validation failed:";

          if (errors.email?.code === "validation_invalid_email") {
              errorMessage += " Email is invalid or already in use.";
          }
          if (errors.username?.code === "validation_invalid_username") {
              errorMessage += " Username is invalid or already in use.";
          }

          return next(new AppError(errorMessage.trim(), 400));
      }

      return next(new AppError("Failed to create user. Please try again.", 500));
  }
};