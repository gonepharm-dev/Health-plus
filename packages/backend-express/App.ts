import express, { type NextFunction, type Request, type Response } from 'express';
import { DatabaseConnect } from './middlewares/database';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import AppError from './utils/AppError';

import userRoute from './routes/userRoute';
import appointRoute from './routes/appointmentRoute'

const app = express();
const PORT = 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(morgan('dev'));
app.use(cors());

// Routing
app.use('/api/collections/users', userRoute);
app.use('/api/realtime', appointRoute);

// Base route
app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        status: 'success',
        message: 'Welcome to our base url',
        version: '0.0.1',
    });
});

// Handling unhandled routes
app.use('*', (req: Request, res: Response, next: NextFunction) => {
    return next(new AppError(`This route ${req.originalUrl} is not yet defined...`, 404)); // Use 404 for "Not Found"
});

// Error handling middleware(global)
app.use((err: AppError, req: Request, res: Response, next: NextFunction) => {
    res.status(err.statusCode || 500).json({
        status: err.status || 'error',
        message: err.message || 'Internal server error',
    });
});

// Connect to the database and start the server
DatabaseConnect()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is listening on port: ${PORT} 🍃`);
        });
    })
    .catch(() => {
        console.log('Error connecting to the database...');
    });