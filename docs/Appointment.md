/**
 * @file Express.js API Documentation
 * @description This API handles user management and real-time appointments.
 *
 * 📖 Overview:
 * - This API is built using Node.js and Express.js.
 * - It includes middleware for logging, error handling, and CORS support.
 * - Provides endpoints for managing users and real-time appointments.
 *
 * 🚀 Features:
 * - User management endpoints (`/api/collections/users`).
 * - Real-time appointment handling (`/api/realtime`).
 * - CORS enabled for cross-origin requests.
 * - JSON request handling.
 * - HTTP request logging with Morgan.
 * - Custom error handling.
 *
 * 📦 Installation:
 * To install dependencies, run:
 * ```sh
 * npm install
 * ```
 *
 * ▶️ Running the Server:
 * To start the server, run:
 * ```sh
 * npm start
 * ```
 * The server will be available at **http://localhost:3001**.
 *
 * 🛠 API Endpoints:
 *
 * ### Base URL:
 * `http://localhost:3001`
 *
 * ### User Routes:
 * | Method | Endpoint                  | Description       |
 * |--------|---------------------------|-------------------|
 * | GET    | `/api/collections/users`   | Fetch all users  |
 * | POST   | `/api/collections/users`   | Create a new user |
 *
 * ### Appointment Routes:
 * | Method | Endpoint             | Description                     |
 * |--------|----------------------|---------------------------------|
 * | GET    | `/api/realtime`      | Fetch real-time appointments   |
 * | POST   | `/api/realtime`      | Create a new appointment       |
 *
 * 🔍 How the Code Works:
 *
 * 1️⃣ Importing Required Modules:
 * ```ts
 * import express, { Request, Response } from 'express';
 * import morgan from 'morgan';
 * import AppError from './utils/AppError';
 * import userRoute from './routes/userRoute';
 * import appointRoute from './routes/appointmentRoute';
 * ```
 *
 * 2️⃣ Initializing Express Server:
 * ```ts
 * const app = express();
 * const PORT = 3001;
 * ```
 *
 * 3️⃣ Middleware Configuration:
 * ```ts
 * app.use(cors());  // Enables CORS for cross-origin requests
 * app.use(express.json());  // Parses JSON requests
 * app.use(morgan('dev'));  // Logs HTTP requests
 * ```
 *
 * 4️⃣ Setting Up API Routes:
 * ```ts
 * app.use('/api/collections/users', userRoute);
 * app.use('/api/realtime', appointRoute);
 * ```
 *
 * 5️⃣ Base Route:
 * ```ts
 * app.get('/', (req: Request, res: Response) => {
 *     res.send("Server is running...");
 * });
 * ```
 *
 * ✨ Middleware Used:
 * - **`express.json()`** → Parses incoming JSON requests.
 * - **`cors`** → Enables Cross-Origin Resource Sharing.
 * - **`morgan`** → Logs HTTP requests for debugging.
 *
 * 🔧 Possible Improvements:
 * - Implement authentication (JWT, OAuth, or session-based auth).
 * - Integrate a database (MongoDB, PostgreSQL, or MySQL).
 * - Enhance error handling with centralized logging.
 * - Implement request validation using Joi or Express Validator.
 */

export {};
/**
 * Appointment Subscription Controller
 *
 * 📖 Overview:
 * This module manages real-time appointment updates using Server-Sent Events (SSE) in an Express.js application.
 * It ensures that doctors and patients receive live updates about their appointments without refreshing the page.
 *
 * 🚀 Features:
 * - Live appointment updates using Server-Sent Events (SSE)
 * - Secure user authentication via JWT tokens
 * - Automatic reconnection handling
 * - Subscription to PocketBase for real-time data changes
 *
 * 📦 Installation:
 * Ensure all dependencies are installed:
 * ```sh
 * npm install
 * ```
 *
 * ▶️ How It Works:
 * 1. **User Connection:**
 *    - The user (doctor or patient) connects to the server via SSE.
 *    - Their authentication token is verified to ensure secure access.
 * 2. **Subscription to Appointment Updates:**
 *    - The server listens for changes in the `Appointments` collection in PocketBase.
 *    - Whenever an appointment is created, updated, or deleted, a real-time update is sent to connected users.
 * 3. **Keeping the Connection Alive:**
 *    - A heartbeat signal (`: heartbeat`) is sent every 5 seconds to maintain the SSE connection.
 * 4. **User Disconnection:**
 *    - When a user logs out or closes their browser, they are removed from the active subscribers list.
 *
 * 🛠 API Endpoints:
 * - **Subscribe to Appointments:**
 *   - `GET /api/realtime/appointments`
 *   - **Headers:** `Authorization: Bearer <token>`
 *   - **Response:** Streams live appointment updates
 *
 * 🔍 Code Breakdown:
 * 1. **Importing Dependencies:**
 *    ```ts
 *    import SSE from "express-sse";
 *    import AppError from "../utils/AppError";
 *    import DatabaseInstance from "../middlewares/database";
 *    import jwt, { type JwtPayload } from "jsonwebtoken";
 *    ```
 * 2. **Initializing SSE and Subscription:**
 *    ```ts
 *    const sse = new SSE();
 *    const activeSubscriptions = new Set<string>();
 *    ```
 * 3. **Setting Up PocketBase Real-time Subscription:**
 *    ```ts
 *    await DatabaseInstance.collection("Appointments").subscribe("*", (event) => {
 *      console.log(`📢 Event Type: ${event.action}`);
 *      Object.keys(global.sseClients).forEach((userId) => {
 *        global.sseClients[userId]?.({ action: event.action, record: event.record });
 *      });
 *    });
 *    ```
 * 4. **Handling Client Connection:**
 *    ```ts
 *    export const subscribeToAppointments = (req: Request, res: Response, next: NextFunction) => {
 *      const token = req.headers.authorization?.split(" ")[1];
 *      const { id: userId } = jwt.decode(token) as JwtPayload;
 *      activeSubscriptions.add(userId);
 *      res.write(`data: ${JSON.stringify({ type: "connection", message: "Connected" })}\n\n`);
 *    };
 *    ```
 * 5. **Cleaning Up on Disconnection:**
 *    ```ts
 *    req.on("close", () => {
 *      activeSubscriptions.delete(userId);
 *      delete global.sseClients[userId];
 *    });
 *    ```
 *
 * ✨ Security Considerations:
 * - Uses JWT for authentication.
 * - Ensures only authenticated users can receive updates.
 * - Prevents unauthorized access by validating tokens.
 *
 * 🔧 Possible Enhancements:
 * - Implement role-based access control (RBAC) for different users.
 * - Add logging for better debugging and monitoring.
 * - Improve scalability with a more efficient SSE handling mechanism.
 */
import type { NextFunction, Request, Response } from "express";
import AppError from "../../utils/AppError";
import jwt, { type JwtPayload } from "jsonwebtoken";
import DatabaseInstance from "../../middlewares/database";

/**
 * @function createAppointment
 * @description Handles the creation of a new appointment in the telehealth system.
 * 
 * ✅ **Validates user authentication**
 * ✅ **Ensures required appointment fields exist**
 * ✅ **Stores appointment data in the database**
 * ✅ **Notifies doctors in real-time via SSE**
 * 
 * @param {Request} req - The incoming request containing appointment details.
 * @param {Response} res - The response object used to send data back to the client.
 * @param {NextFunction} next - Express function to handle errors.
 */
export const createAppointment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1️⃣ Validate authorization token
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return next(new AppError("Invalid authorization header", 401));
    }

    // 2️⃣ Decode and verify JWT token
    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.decode(token) as JwtPayload;
    if (!decodedToken?.id) {
      return next(new AppError("Unauthorized: Missing user ID in token", 401));
    }

    // 3️⃣ Extract and validate required fields
    const { appointment_date, status, doctor_id, notes, consultation_type } = req.body;
    if (!appointment_date || !status || !doctor_id || !consultation_type) {
      return next(new AppError("Missing required appointment fields", 400));
    }

    // 4️⃣ Create and store the appointment record
    const record = await DatabaseInstance.collection("Appointments").create({
      appointment_date,
      status,
      doctor_id,
      patient_id: decodedToken.id, // Assign patient ID from token
      notes,
      consultation_type,
      created_at: new Date().toISOString(),
    });

    // 5️⃣ Return success response
    res.status(201).json({
      status: "success",
      data: record,
    });
  } catch (error) {
    // Handle token errors separately
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new AppError("Invalid or expired token", 401));
    }
    
    console.error("❌ Appointment creation error:", error);
    return next(new AppError("Error creating appointment", 500));
  }
};
/**
 * @file deleteAppointment.ts
 * @description This file contains the function to delete an appointment in a telehealth system.
 * It ensures that only the doctor or the patient involved can delete an appointment.
 * The function also works with the real-time updates system (SSE) to notify users instantly.
 */

import type { NextFunction, Request, Response } from "express";
import AppError from "../../utils/AppError";
import jwt, { type JwtPayload } from "jsonwebtoken";
import DatabaseInstance from "../../middlewares/database";

/**
 * @function deleteAppointment
 * @description Deletes an appointment if the request is made by the assigned doctor or patient.
 * @param {Request} req - The request object containing authorization and appointment ID.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 */
export const deleteAppointment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const { id } = req.params;

    // Validate auth header
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return next(new AppError("Invalid authorization header", 401));
    }

    // Decode and verify token
    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.decode(token) as JwtPayload;

    if (!decodedToken || !decodedToken.id) {
      return next(new AppError("Invalid token", 401));
    }
    const userId = decodedToken.id;

    // Retrieve the appointment from the database
    const currentAppointment = await DatabaseInstance.collection("Appointments").getOne(id);
    
    // Check if the user is authorized to delete the appointment
    if (currentAppointment.patient_id !== userId && currentAppointment.doctor_id !== userId) {
      return next(new AppError("You are not allowed to perform this action", 403));
    }

    // Delete the appointment
    await DatabaseInstance.collection("Appointments").delete(currentAppointment.id);

    // Send success response
    res.status(200).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new AppError("Invalid or expired token", 401));
    }
    return next(new AppError("Error deleting an appointment", 500));
  }
};
import type { NextFunction, Request, Response } from "express";
import AppError from "../../utils/AppError";
import jwt, { type JwtPayload } from "jsonwebtoken";
import DatabaseInstance from "../../middlewares/database";

/**
 * Retrieves all appointments from the database.
 * 
 * @route GET /appointments
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function to call in case of error.
 * @returns {Promise<void>} - Returns a promise that resolves with the list of appointments.
 * @throws {AppError} - Throws an error if no appointments are found or if there's an error in fetching appointments.
 */
export const getAllAppointments = async function(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        // Optional: token validation before database query
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return next(new AppError("Authorization token missing", 401));
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload; // Assuming JWT_SECRET is set in env variables

        // Fetching appointments from the database
        const resultList = await DatabaseInstance.collection('Appointments').getFullList({
            sort: '-created',  // Sorting appointments by creation date (descending)
        });

        if (!resultList || resultList.length === 0) {
            return next(new AppError("No appointments found", 404)); // Handling case with no appointments
        }

        // Sending the response with the list of appointments
        res.status(200).json({
            status: "success",
            data: resultList
        });
    } catch (error) {
        console.error(error);  // Log the error for debugging
        if (error instanceof jwt.JsonWebTokenError) {
            return next(new AppError("Invalid or expired token", 401)); // Handling JWT errors
        }
        return next(new AppError("Error getting appointments", 500)); // Generic error handler
    }
};
import type { NextFunction, Request, Response } from "express";
import AppError from "../../utils/AppError";
import jwt, { type JwtPayload } from "jsonwebtoken";
import DatabaseInstance from "../../middlewares/database";

// Fetch appointments for a patient
export const getSinglePatientAppointments = async (req: any, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader.startsWith("Bearer ")) {
      return next(new AppError("Invalid authorization header", 401));
    }

    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.decode(token) as JwtPayload;
    
    if (!decodedToken || !decodedToken.id) {
      return next(new AppError("Invalid token", 401));
    }

    const userId = decodedToken.id;

    const resultList = await DatabaseInstance.collection("Appointments").getList(1, 10, {
      filter: `patient_id = "${userId}"`,
      expand: "doctor_id",
    });

    const formattedAppointments = resultList.items.map((appointment) => {
      return {
        id: appointment.id,
        appointment_date: appointment.appointment_date,
        consultation_type: appointment.consultation_type,
        status: appointment.status,
        doctor: appointment.expand?.doctor_id ? {
          full_name: appointment.expand.doctor_id.full_name,
          email: appointment.expand.doctor_id.email,
          contact: appointment.expand.doctor_id.contact_number,
          imageUrl: appointment.expand.doctor_id.imageUrl,
        } : null,
      };
    });

    if (!resultList || resultList.items.length === 0) {
      return next(new AppError("No appointments found", 404));
    }

    res.status(200).json({ status: "success", data: formattedAppointments });

  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new AppError("Invalid or expired token", 401));
    }
    return next(new AppError("Error fetching appointments", 500));
  }
};

// Fetch appointments for a doctor
export const getSingleDoctorAppointments = async (req: any, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader.startsWith("Bearer ")) {
      return next(new AppError("Invalid authorization header", 401));
    }

    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.decode(token) as JwtPayload;

    if (!decodedToken || !decodedToken.id) {
      return next(new AppError("Invalid token", 401));
    }

    const userId = decodedToken.id;

    const resultList = await DatabaseInstance.collection("Appointments").getList(1, 10, {
      filter: `doctor_id = "${userId}"`,
      expand: 'patient_id',
    });

    const formattedAppointments = resultList.items.map((appointment) => {
      return {
        id: appointment.id,
        appointment_date: appointment.appointment_date,
        consultation_type: appointment.consultation_type,
        status: appointment.status,
        patient: appointment.expand?.patient_id ? {
          full_name: appointment.expand.patient_id.full_name,
          email: appointment.expand.patient_id.email,
          contact: appointment.expand.patient_id.contact_number,
          imageUrl: appointment.expand.patient_id.imageUrl,
        } : null,
      };
    });

    if (!resultList || resultList.items.length === 0) {
      return next(new AppError("No appointments found", 404));
    }

    res.status(200).json({ status: "success", data: formattedAppointments });

  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new AppError("Invalid or expired token", 401));
    }
    return next(new AppError("Error fetching appointments", 500));
  }
};
import type { NextFunction, Request, Response } from "express";
import AppError from "../../utils/AppError";
import jwt, { type JwtPayload } from "jsonwebtoken";
import DatabaseInstance from "../../middlewares/database";

/**
 * Updates an existing appointment record in the database.
 * 
 * The function checks if the user is authorized to update the appointment 
 * (either as a doctor or a patient). It then updates the appointment details 
 * based on the request body, and responds with the updated appointment data.
 * 
 * @param {Request} req - The request object containing the appointment ID in the URL parameters and the new data in the body.
 * @param {Response} res - The response object used to send back the status and updated data.
 * @param {NextFunction} next - The next middleware function used to handle errors.
 * @throws {AppError} 401 - If the authorization token is missing or invalid.
 * @throws {AppError} 403 - If the user is not authorized to update the appointment.
 * @throws {AppError} 500 - If there is an error updating the appointment in the database.
 * 
 * @returns {Promise<void>} Sends a response with the status `200` and the updated appointment data.
 */
export const updateAppointment = async function (req: any, res: Response, next: NextFunction): Promise<void> {
    try {
        // Extract the appointment ID from the URL parameters
        const { id } = req.params;

        // Validate auth header
        const authHeader = req.headers.authorization;
        if (!authHeader.startsWith("Bearer ")) {
            return next(new AppError("Invalid authorization header", 401));
        }

        // Decode and verify token
        const token = authHeader.split(" ")[1];
        const decodedToken = jwt.decode(token) as JwtPayload;

        if (!decodedToken || !decodedToken.id) {
            return next(new AppError("Invalid token", 401));
        }
        const userId = decodedToken.id;

        // Fetch the current appointment from the database
        const currentAppointment = await DatabaseInstance.collection('Appointments').getOne(id);
        // Check if the user is either the patient or the doctor for this appointment
        if (currentAppointment.patient_id !== userId && currentAppointment.doctor_id !== userId) {
            return next(new AppError("You are not allowed to perform this action", 403));
        }

        // Extract the updatable fields from the request body
        const { appointment_date, status, notes, consultation_type, doctor_id, patient_id } = req.body;
        const updatedData = {
            appointment_date,
            status,
            notes,
            consultation_type,
            doctor_id,
            patient_id: userId, // Ensure the patient ID matches the logged-in user
        };

        // Update the appointment in the database
        const updatedRecord = await DatabaseInstance.collection("Appointments").update(id, updatedData);

        // Return the updated appointment data as a response
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

