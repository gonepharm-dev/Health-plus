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

