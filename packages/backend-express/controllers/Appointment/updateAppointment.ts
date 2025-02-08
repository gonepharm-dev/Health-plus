import type { NextFunction, Request, Response } from "express";
import AppError from "../../utils/AppError";
import jwt, { type JwtPayload } from "jsonwebtoken";
import DatabaseInstance from "../../middlewares/database";

export const updateAppointment = async function (req: any, res: Response, next: NextFunction) {
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
        
        // Extract updatable fields from request body
        const { appointment_date, status, notes, consultation_type, doctor_id, patient_id } = req.body;

        const updatedData = {
            appointment_date,
            status,
            notes,
            consultation_type,
            doctor_id,
            patient_id:userId,
        };

        // Update the appointment record
        const updatedRecord = await DatabaseInstance.collection("Appointments").update(id, updatedData);

        res.status(200).json({
            status: "success",
            message: "Appointment updated successfully",
            data: updatedRecord,
        });
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return next(new AppError("Invalid or expired token", 401));
        }
        return next(new AppError("Error updating appointment", 500));
    }
};