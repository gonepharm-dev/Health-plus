import type { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import validator from "validator";
import jwt, { type JwtPayload } from "jsonwebtoken";
import AppError from "../utils/AppError";
import DatabaseInstance from "../middlewares/database";

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

// protecting routes
export const protect = async (req: any, res: Response, next: NextFunction) => {
  try {
    const authHeaders = req.headers.authorization;

    if (!authHeaders) {
      return next(new AppError('No authorization headers', 401));
    }

    const token = authHeaders.split(' ')[1];

    if (!token) {
      return next(new AppError('You are not logged in', 401));
    }

    // Decode and verify the token
    const decodedToken = jwt.decode(token) as JwtPayload

    // Retrieve the user from PocketBase based on the decoded token's id
    const userData = await DatabaseInstance.collection('users').getOne(decodedToken.id, {
      expand:'role'
    });

    if (!userData) {
      return next(new AppError('This user does not exist', 401));
    }

    // Attach the user to the request object
    req.user = userData;

    next();
  } catch (error:any) {
    return next(new AppError('Error protecting route',500));
  }
};

// Restrict (Authorizations => Configurable middleware)
export const RestrictTo = function(...role:string[]){
  return (req:any, res:Response , next:NextFunction)=>{
    if(!role.includes(req.user.role)){
      return next(new AppError("You do not have the required permissions", 403))
    }
    next();
  }
}

/**
 * Handles password reset request initiation
 * Generates a reset token and sends it to user's email
 * 
 * @param {Request} req - Express request object containing email in body
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 */
export const PasswordReset = async function (req: Request, res: Response, next: NextFunction) {
  try {
    // Extract email from request body
    const { email } = req.body;

    // Validate email presence
    if (!email) {
      return next(new AppError("Email is required", 400));
    }

    // Request password reset from PocketBase
    // This will:
    // 1. Verify if the email exists in the database
    // 2. Generate a unique reset token
    // 3. Send an email with reset instructions
    const sendToken = await DatabaseInstance.collection("users").requestPasswordReset(email);

    // Verify if token generation was successful
    if (!sendToken) {
      return next(new AppError("Failed to send password reset email", 500));
    }

    // Send success response
    res.status(200).json({
      status: "success",
      message: "Password reset email sent successfully",
      data: sendToken
    });
  } catch (error: any) {
    // Handle any unexpected errors
    return next(new AppError("Something went wrong, please try again", 500));
  }
};

/**
 * Handles password reset confirmation
 * Validates the reset token and updates the password
 * 
 * @param {Request} req - Express request object containing token and passwords
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 */
export const ConfirmPasswordReset = async function (req: Request, res: Response, next: NextFunction) {
  try {
    // Extract required data from request body
    const { token, password, newPassword } = req.body;

    // Validate presence of reset token
    if (!token) {
      return next(new AppError("Reset token is required", 400));
    }

    // Validate presence of both passwords
    if (!password || !newPassword) {
      return next(new AppError("Both current and new passwords are required", 400));
    }

    // Validate new password strength using validator
    // Requirements:
    // - Minimum length: 8 characters
    // - At least 1 number
    // - At least 1 uppercase letter
    // - At least 1 special character
    if (!validator.isStrongPassword(newPassword, { 
      minLength: 8, 
      minNumbers: 1, 
      minUppercase: 1, 
      minSymbols: 1 
    })) {
      return next(new AppError(
        "New password must be at least 8 characters long and include a number, an uppercase letter, and a special character",
        400
      ));
    }

    // Ensure new password is different from current password
    if (password === newPassword) {
      return next(new AppError("New password must be different from the old password", 400));
    }

    // Attempt to confirm password reset with PocketBase
    // This will:
    // 1. Validate the reset token
    // 2. Check token expiration
    // 3. Update the password if valid
    const resetConfirmation = await DatabaseInstance.collection("users").confirmPasswordReset(
      token,
      password,
      newPassword
    );

    // Check if reset was successful
    if (!resetConfirmation) {
      return next(new AppError("Invalid or expired token", 400));
    }

    // Send success response
    res.status(200).json({
      status: "success",
      message: "Password has been reset successfully",
      data: null
    });
  } catch (error: any) {
    // Handle any unexpected errors
    return next(new AppError("Something went wrong, please try again", 500));
  }
};

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