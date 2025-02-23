import PocketBase from 'pocketbase';
import dotenv from 'dotenv';

// Load the single .env file
dotenv.config();

// Get environment-specific configuration
const getDatabaseUrl = () => {
  const env = process.env.NODE_ENV || 'development';
  return env === 'production' 
    ? process.env.DATABASE_URL_PROD 
    : process.env.DATABASE_URL_DEV;
};

// Validate required environment variables
if (!process.env.DATABASE_URL_DEV) {
  throw new Error('DATABASE_URL_DEV must be defined in .env');
}

if (process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL_PROD) {
  throw new Error('DATABASE_URL_PROD must be defined in .env for production');
}

// Initialize PocketBase
const DatabaseInstance = new PocketBase(getDatabaseUrl());

export const DatabaseConnect = async function () {
  try {
    await DatabaseInstance.health.check();
    console.log(`Connected to PocketBase (${process.env.NODE_ENV || 'development'}) 🚀`);
  } catch (err: any) {
    console.error('Database connection failed:', err.message);
    process.exit(1);
  }
};

export default DatabaseInstance;