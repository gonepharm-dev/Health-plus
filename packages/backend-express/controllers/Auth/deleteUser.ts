import type { NextFunction, Request, Response } from "express";
import AppError from "../../utils/AppError";
import DatabaseInstance from "../../middlewares/database";

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
        return next(new AppError("Error deleting users", 500))
    }
}