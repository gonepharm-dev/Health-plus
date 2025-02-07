import type { NextFunction, Request, Response } from "express";
import AppError from "../../utils/AppError";
import jwt, { type JwtPayload } from "jsonwebtoken";
import DatabaseInstance from "../../middlewares/database";

export const getSinglePatientAppointments = async function(req: any, res: Response, next: NextFunction) {
    try {
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

        // Fetch paginated user appointments
        const resultList = await DatabaseInstance.collection("Appointments").getList(1, 10, {
            filter: `patient_id = "${userId}"`,
            expand: "doctor_id",
        });

        // Process and filter the response
        const formattedAppointments = resultList.items.map((appointment) => {
            return {
                id: appointment.id,
                appointment_date: appointment.appointment_date,
                consultation_type: appointment.consultation_type,
                status: appointment.status,
                notes: appointment.notes,
                created: appointment.created,
                updated: appointment.updated,
                doctor: appointment.expand?.doctor_id
                    ? {
                        full_name: appointment.expand.doctor_id.full_name,
                        email: appointment.expand.doctor_id.email,
                        contact: appointment.expand.doctor_id.contact_number,
                        imageUrl: appointment.expand.doctor_id.imageUrl,
                    }
                    : null, 
            };
        });
        

        if (!resultList || resultList.items.length === 0) {
            return next(new AppError("No appointments found", 404));
        }

        res.status(200).json({
            status: "success",
            data: formattedAppointments
        });
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return next(new AppError("Invalid or expired token", 401));
          }
        return next(new AppError("Error fetching appointments", 500));
    }
};

export const getSingleDoctorAppointments = async function(req: any, res: Response, next: NextFunction) {
    try {
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

        // Fetch paginated appointments
        const resultList = await DatabaseInstance.collection("Appointments").getList(1, 10, {
            filter: `doctor_id = "${userId}"`,
            expand: 'patient_id'
        });

        // Process and filter the response
        const formattedAppointments = resultList.items.map((appointment) => {
            return {
                id: appointment.id,
                appointment_date: appointment.appointment_date,
                consultation_type: appointment.consultation_type,
                status: appointment.status,
                notes: appointment.notes,
                created: appointment.created,
                updated: appointment.updated,
                patient: appointment.expand?.patient_id
                    ? {
                        full_name: appointment.expand.patient_id.full_name,
                        email: appointment.expand.patient_id.email,
                        contact: appointment.expand.patient_id.contact_number,
                        imageUrl: appointment.expand.patient_id.imageUrl,
                    }
                    : null, 
            };
        });

        if (!resultList || resultList.items.length === 0) {
            return next(new AppError("No appointments found", 404));
        }

        res.status(200).json({
            status: "success",
            data: formattedAppointments
        });
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return next(new AppError("Invalid or expired token", 401));
          }
        return next(new AppError("Error fetching appointments", 500));
    }
};