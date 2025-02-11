/**
 * Express.js API Documentation
 *
 * 📖 Overview:
 * This is a Node.js and Express.js API that includes user management and real-time appointment functionalities.
 * The API is built using Express and includes middleware for logging, error handling, and CORS support.
 *
 * 🚀 Features:
 * - User management endpoints
 * - Real-time appointment handling
 * - CORS enabled for cross-origin requests
 * - JSON request handling
 * - HTTP request logging using Morgan
 * - Custom error handling
 *
 * 📦 Installation:
 * 1. Install dependencies:
 *    ```sh
 *    npm install
 *    ```
 *
 * ▶️ Running the Server:
 * To start the server, run:
 *    ```sh
 *    npm start
 *    ```
 * The server will start on **http://localhost:3001**.
 *
 * 🛠 API Endpoints:
 * Base URL: `http://localhost:3001`
 *
 * User Routes:
 * - GET `/api/collections/users` → Fetch all users
 * - POST `/api/collections/users` → Create a user
 *
 * Appointment Routes:
 * - GET `/api/realtime` → Fetch real-time appointments
 * - POST `/api/realtime` → Create a new appointment
 *
 * 🔍 How the Code Works:
 * 1. Importing Required Modules:
 *    ```ts
 *    import express, { Request, Response } from 'express';
 *    import morgan from 'morgan';
 *    import cors from 'cors';
 *    import AppError from './utils/AppError';
 *    import userRoute from './routes/userRoute';
 *    import appointRoute from './routes/appointmentRoute';
 *    ```
 * 2. Initializing Express Server:
 *    ```ts
 *    const app = express();
 *    const PORT = 3001;
 *    ```
 * 3. Middleware Configuration:
 *    ```ts
 *    app.use(cors());
 *    app.use(express.json());
 *    app.use(morgan('dev'));
 *    ```
 * 4. Setting Up API Routes:
 *    ```ts
 *    app.use('/api/collections/users', userRoute);
 *    app.use('/api/realtime', appointRoute);
 *    ```
 * 5. Base Route:
 *    ```ts
 *    app.get('/', (req: Request, res: Response) => {
 *        res.send("Server is running...");
 *    });
 *    ```
 *
 * ✨ Middleware Used:
 * - `express.json()` → Parses incoming JSON requests.
 * - `cors` → Enables Cross-Origin Resource Sharing.
 * - `morgan` → Logs HTTP requests for debugging.
 *
 * 🔧 Possible Improvements:
 * - Implement authentication (JWT, OAuth, or session-based auth).
 * - Integrate a database (MongoDB, PostgreSQL, or MySQL).
 * - Enhance error handling with centralized logging.
 * - Implement request validation using Joi or Express Validator.
 */

export {};
