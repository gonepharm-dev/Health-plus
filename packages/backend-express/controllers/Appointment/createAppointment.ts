import type { NextFunction, Request, Response } from "express";
import AppError from "../../utils/AppError";
import jwt, { type JwtPayload } from "jsonwebtoken";
import DatabaseInstance from "../../middlewares/database";

export const createAppointment = async ( req: Request, res: Response, next: NextFunction ) => {
    try {
      // Validate auth header
      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith("Bearer ")) {
        return next(new AppError("Invalid authorization header", 401));
      }
  
      // Decode and verify token
      const token = authHeader.split(" ")[1];
      const decodedToken = jwt.decode(token) as JwtPayload;
  
      // Extract and validate required fields
      const { appointment_date, status, doctor_id, notes, consultation_type } = req.body;
  
      if (!appointment_date || !status || !doctor_id || !consultation_type) {
        return next(new AppError("Missing required appointment fields", 400));
      }
  
      // Create appointment record
      const record = await DatabaseInstance.collection("Appointments").create({
        appointment_date,
        status,
        doctor_id,
        patient_id: decodedToken.id,
        notes,
        consultation_type,
        created_at: new Date().toISOString(),
      });
  
      res.status(201).json({
        status: "success",
        data: record,
      });
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        return next(new AppError("Invalid or expired token", 401));
      }
      return next(new AppError("Error creating appointment", 500));
    }
  };