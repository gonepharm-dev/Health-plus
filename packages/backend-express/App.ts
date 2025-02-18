import express, { type NextFunction, type Request, type Response } from 'express';
import { createServer } from 'http';
import { Server } from "socket.io";
import { DatabaseConnect } from './middlewares/database';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import AppError from './utils/AppError';

import userRoute from './routes/userRoute';
import appointRoute from './routes/appointmentRoute';
import initializeSocket from './middlewares/socketConfig';
import videoSessionRoute from './routes/videoSessionRoute';

const app = express();
const PORT = 3001;

const corsOptions = {
    origin: ["http://localhost:5173", "https://yourfrontenddomain.com"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
};

// Create HTTP server to wrap Express app
const server = createServer(app);

// Initialize Socket.io with attachment to HTTP server
const io = new Server(server, { cors: corsOptions });

io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
    });
});

// Initialize Socket.io
initializeSocket(io);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(morgan('dev'));
app.use(cors(corsOptions));

// Routing
app.use('/api/collections/users', userRoute);
app.use('/api/realtime', appointRoute);
app.use('/api/v1/videoSession', videoSessionRoute)

// Base route
app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        status: 'success',
        message: 'Welcome to our base URL',
        version: '0.0.1',
    });
});

// Handling unhandled routes
app.use('*', (req: Request, res: Response, next: NextFunction) => {
    return next(new AppError(`This route ${req.originalUrl} is not yet defined...`, 404));
});

// Error handling middleware (global)
app.use((err: AppError, req: Request, res: Response, next: NextFunction) => {
    res.status(err.statusCode || 500).json({
        status: err.status || 'error',
        message: err.message || 'Internal server error',
    });
});

// Connect to the database and start the server
DatabaseConnect()
    .then(() => {
        server.listen(PORT, () => { 
            console.log(`Server is listening on port: ${PORT} 🚀`);
        });
    })
    .catch(() => {
        console.log('Error connecting to the database...');
    });