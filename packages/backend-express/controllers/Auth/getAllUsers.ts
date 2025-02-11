import type { NextFunction, Request, Response } from "express";
import DatabaseInstance from "../../middlewares/database";
import AppError from "../../utils/AppError";

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const users = await DatabaseInstance.collection('users').getFullList({
            sort: '-created',
        });

        res.status(200).json({
            status: "success",
            data: users.length > 0 ? users : [],
        });
    } catch (error: any) {
        console.error(`Error fetching users: ${error.message}`);
        return next(new AppError("Error getting users", 500));
    }
};
