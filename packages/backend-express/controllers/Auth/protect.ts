import type { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import jwt, { type JwtPayload } from "jsonwebtoken";
import AppError from "../../utils/AppError";
import DatabaseInstance from "../../middlewares/database";

dotenv.config();

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