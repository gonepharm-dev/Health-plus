import type { NextFunction, Request, Response } from "express";
import  jwt, {type JwtPayload } from "jsonwebtoken";
import AppError from "../../utils/AppError";
import DatabaseInstance from "../../middlewares/database";

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

        const activate =await DatabaseInstance.collection('users').update(decodeToken.id, {
            active: true
        })

        res.status(200).json({
            status:"success",
            data: activate
        })
    } catch (error:any) {
        return next(new AppError("Error deactivating user", 500))
    }
}