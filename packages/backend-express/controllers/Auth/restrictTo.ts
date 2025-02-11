import type { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import AppError from "../../utils/AppError";

dotenv.config();

// Restrict (Authorizations => Configurable middleware)
export const RestrictTo = function(...role:string[]){
  return (req:any, res:Response , next:NextFunction)=>{
    if(!role.includes(req.user.role)){
      return next(new AppError("You do not have the required permissions", 403))
    }
    next();
  }
}