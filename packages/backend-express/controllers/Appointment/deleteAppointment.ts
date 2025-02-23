import type { NextFunction, Request, Response } from "express";
import AppError from "../../utils/AppError";
import jwt, { type JwtPayload } from "jsonwebtoken";
import DatabaseInstance from "../../middlewares/database";

export const deleteAppointment = async function(req:any, res:Response, next:NextFunction){
    try {
        const { id } = req.params;
        // Validate auth header
        const authHeader = req.headers.authorization;
        if (!authHeader.startsWith("Bearer ")) {
            return next(new AppError("Invalid authorization header", 401));
        }

        // Decode and verify token
        const token = authHeader.split(" ")[1];

        const decodedToken = jwt.decode(token)as JwtPayload;
        
        if (!decodedToken || !decodedToken.id) {
            return next(new AppError("Invalid token", 401));
        }

        const userId = decodedToken.id;

        // get the appointment created by the user
        const currentAppointment = await DatabaseInstance.collection('Appointments').getOne(id);

        if (currentAppointment.patient_id !== userId && currentAppointment.doctor_id !== userId) {
            return next(new AppError("You are not allowed to perform this action", 403));
        }

        await DatabaseInstance.collection('Appointments').delete(currentAppointment.id);

        res.status(200).json({
            statu:"success",
            data:null
        })
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return next(new AppError("Invalid or expired token", 401));
          }
        return next(new AppError("Error deleting an appointment", 500))
    }
}