import type { NextFunction, Request, Response } from "express";
import AppError from "../utils/AppError";
import DatabaseInstance from "../middlewares/database";
import  jwt, {type JwtPayload } from "jsonwebtoken";

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

export const DeleteUser = async function(req:Request, res:Response, next:NextFunction){
    try {
        const {id}= req.params;

        if(!id){
            return next(new AppError("User_Id is required", 401))
        }

        //check if the user exists in the database
        const user = await DatabaseInstance.collection('users').getOne(id);

        if(!user){
            return next(new AppError("User not found", 401))
        }

        //delete the user from the database
        await DatabaseInstance.collection('users').delete(user.id)

        res.status(200).json({
            status:"success",
            data:null
        })
    } catch (error) {
        console.log(`Error :${error}`)
        return next(new AppError("Error deleting users", 500))
    }
}

// perfoming soft-delete
export const DeactivateAccount = async function(req:Request, res:Response, next:NextFunction){
    try {
        // get the user id from the network
        const authHeader = req.headers.authorization;

        if(!authHeader){
            return next(new AppError("Not logged In", 401))
        }

        let token = authHeader.split(" ")[1]

        //decode the token
        const decodeToken = jwt.decode(token) as JwtPayload;

        const deactivate =await DatabaseInstance.collection('users').update(decodeToken.id, {
            active: false
        })

        res.status(200).json({
            status:"success",
            data: deactivate
        })
    } catch (error:any) {
        console.log(`Error :${error.data}`)
        return next(new AppError("Error deactivating user", 500))
    }
}

export const ActivateAccount = async function(req:Request, res:Response, next:NextFunction){
    try {
        // get the user id from the network
        const authHeader = req.headers.authorization;

        if(!authHeader){
            return next(new AppError("Not logged In", 401))
        }

        let token = authHeader.split(" ")[1]

        //decode the token
        const decodeToken = jwt.decode(token) as JwtPayload;
        console.log(decodeToken.id);

        const activate =await DatabaseInstance.collection('users').update(decodeToken.id, {
            active: true
        })

        res.status(200).json({
            status:"success",
            data: activate
        })
    } catch (error:any) {
        console.log(`Error :${error.data}`)
        return next(new AppError("Error deactivating user", 500))
    }
}
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

        // Decode and verify the token
        const decodedToken = jwt.decode(token) as JwtPayload;

        if (!decodedToken) {
            return next(new AppError('Invalid token or token expired', 401));
        }

        // Retrieve the user from PocketBase based on the decoded token's id
        const userData = await DatabaseInstance.collection('users').getOne(decodedToken.id);

        if (!userData) {
            return next(new AppError('This user does not exist', 401));
        }

        // Upload profile picture
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

        res.status(200).json({
            status: 'success',
            message: 'Profile picture updated successfully',
            data: updatedUser,
        });
    } catch (error: any) {
        console.error('Error in ProfilePicture:', error.message || error); // Debugging
        return next(new AppError('Error adding profile picture', 500));
    }
};