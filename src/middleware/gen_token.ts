// import { Response, Request } from "express";
// import jwt from "jsonwebtoken";
// const secretKey = "pooja";
// export const jwttoken=({payload}, expire=3000, secretkey="pooja")=>{
//     return jwt.sign(payload,{expireIn:expire} ,secretkey)
// }
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
const secretKey = "pooja";

export function createToken(req:Request){

    const key = secretKey
    const token = jwt.sign(
        
        { userId: req.body.email },key,{ expiresIn: "1h" }
    );
    // console.log(token);
    return token
}
