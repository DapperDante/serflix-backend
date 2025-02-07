import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ErrorControl } from "../error/error-handling";
export const AuthenticationUser = (req:Request<any>, res:Response<any>, next:NextFunction) => {
	if(req.url.includes('/api/user/login') || req.url.includes('/api/user/register')) return next();
	const token = req.headers['authorization'];
	try{
		jwt.verify(token!, process.env.SECRET_KEY_TOKEN!);
		next();
	}catch(error:any){
		const {code, msg} = ErrorControl(error);
		res.status(code).json({msg});
	}
}
export const AuthenticationProfile = (req:Request<any>, res:Response<any>, next:NextFunction) => {
	if(
		req.url.includes('/api/profile/log-in') || 
		req.url.includes('/api/profile/get-all') || 
		req.url.includes('/api/profile/add') || 
		req.url.includes('/api/user')) 
		return next();
	try{
		const idProfile = decodeJwt(req.headers['authorization']!)?.idProfile;
		if(!idProfile) throw new Error("unauthorized");
		next();
	}catch(error:any){
		const {code, msg} = ErrorControl(error);
		res.status(code).json({msg});
	}
}
export const decodeJwt = (token:string): {
	idUser: number,
	idProfile?: number
} => {
	return jwt.decode(token, {json:true}) as {idUser:number, idProfile?:number};
}

export const createToken = (idUser: number, idProfile?: number): string =>{
	return jwt.sign({idUser, idProfile}, process.env.SECRET_KEY_TOKEN!, {
		expiresIn: "4h"
	});
}