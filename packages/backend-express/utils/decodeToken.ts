import jwt, { type JwtPayload } from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";

export const DecodedToken = async function(req:any, res:Response, next:NextFunction){
    try {
        const authHeaders = req.headers.authorization;

        const token:any = authHeaders.split(" ")[0];

        const decodeToken = jwt.decode(token) as JwtPayload;
        console.log(decodeToken)

        return decodeToken.id;

    } catch (error) {
        console.log(`Error: ${error}`)
        throw new Error("You're not logged In")
    }
}