import express, { type NextFunction, type Request, type Response } from 'express';
import { DatabaseConnect } from './middlewares/database';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import AppError from './utils/AppError';

import userRoute from './routes/userRoute';
import appointRoute from './routes/appointmentRoute';

const app = express();
const PORT = process.env.PORT || 3001;

// Custom logging middleware
const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
    console.log(`\n🔴 ${new Date().toISOString()}`);
    console.log(`📨 ${req.method} ${req.url}`);
    console.log('📋 Headers:', req.headers);
    console.log('📦 Body:', req.body);
    next();
};

// CORS Configuration
const corsOptions = {
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
    optionsSuccessStatus: 200
};

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(loggerMiddleware); // Add custom logger

// Pre-flight requests
app.options('*', cors(corsOptions));

// Additional headers middleware
app.use((req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});

// Routing
app.use('/api/collections/users', userRoute);
app.use('/api/realtime', appointRoute);

// Base route
app.get('/', (req: Request, res: Response) => {
    console.log('✅ Base route accessed');
    res.status(200).json({
        status: 'success',
        message: 'Welcome to our base url',
        version: '0.0.1',
    });
});

// Handling unhandled routes
app.use('*', (req: Request, res: Response, next: NextFunction) => {
    console.log('❌ Unhandled route:', req.originalUrl);
    return next(new AppError(`This route ${req.originalUrl} is not yet defined...`, 404));
});

// Error handling middleware(global)
app.use((err: AppError, req: Request, res: Response, next: NextFunction) => {
    console.error('🔥 Error:', {
        status: err.status,
        message: err.message,
        stack: err.stack
    });

    res.status(err.statusCode || 500).json({
        status: err.status || 'error',
        message: err.message || 'Internal server error',
    });
});

// Connect to the database and start the server
DatabaseConnect()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`\n🚀 Server is running on http://localhost:${PORT}`);
            console.log('📅 Time:', new Date().toISOString());
            console.log('🔌 Environment:', process.env.NODE_ENV);
        });
    })
    .catch((error) => {
        console.error('❌ Database connection failed:', error);
        process.exit(1);
    });

export default app;