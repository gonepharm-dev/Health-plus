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
