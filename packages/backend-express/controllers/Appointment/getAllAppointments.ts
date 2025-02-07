import type { NextFunction, Request, Response } from "express";
import AppError from "../../utils/AppError";
import jwt, { type JwtPayload } from "jsonwebtoken";
import DatabaseInstance from "../../middlewares/database";

export const getAllAppointments = async function(req:Request, res:Response, next:NextFunction){
    try {
        const resultList = await DatabaseInstance.collection('Appointments').getFullList({
            sort: '-created',
        });

        if (!resultList || resultList.length === 0) {
            return next(new AppError("No appointments found", 404));
        }

        res.status(200).json({
            status:"success",
            data: resultList
        })
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return next(new AppError("Invalid or expired token", 401));
          }
        return next(new AppError("Error getting appointments", 500))
    }
}