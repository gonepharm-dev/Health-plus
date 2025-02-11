import type { NextFunction, Request, Response } from "express";
import  jwt, {type JwtPayload } from "jsonwebtoken";
import AppError from "../../utils/AppError";
import DatabaseInstance from "../../middlewares/database";

export const ProfilePicture = async function (req: any, res: Response, next: NextFunction) {
    try {
        const file = req.file;

        const authHeaders = req.headers.authorization;

        if (!authHeaders) {
            return next(new AppError('No authorization headers', 401));
        }

        const token = authHeaders.split(' ')[1];

        if (!token) {
            return next(new AppError('You are not logged in', 401));
        }

        const decodedToken = jwt.decode(token) as JwtPayload;

        if (!decodedToken) {
            return next(new AppError('Invalid token or token expired', 401));
        }

        const userData = await DatabaseInstance.collection('users').getOne(decodedToken.id);

        if (!userData) {
            return next(new AppError('This user does not exist', 401));
        }

        if (!file) {
            return next(new AppError('No file uploaded', 401));
        }

        // Create a File object for PocketBase
        const fileForPocketBase = new File([file.buffer], file.originalname, {
            type: file.mimetype,
        });

        // Update the user's avatar in PocketBase
        const updatedUser = await DatabaseInstance.collection('users').update(decodedToken.id, {
            'avatar': fileForPocketBase,
        });

        // Construct the image URL
        const imageUrl = `${process.env.DATABASE_URL_PROD}api/files/${updatedUser.collectionId}/${updatedUser.id}/${updatedUser.avatar}`;

        const finalUpdatedUser = await DatabaseInstance.collection('users').update(decodedToken.id, {
            imageUrl: imageUrl, 
        });

        res.status(200).json({
            status: 'success',
            message: 'Profile picture updated successfully',
            data: finalUpdatedUser,
        });
    } catch (error: any) {
        console.error('Error adding profile picture:', error);
        return next(new AppError('Error adding profile picture', 500));
    }
};