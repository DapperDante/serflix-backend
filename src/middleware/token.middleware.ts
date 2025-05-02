import { NextFunction, Request, Response } from "express";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import { ENV_SETUP } from "../config/variables.config";
import { decodeTokenAuthentication, decodeTokenLogProfile } from "../config/token.config";

export const isValidToken = (req:Request<any>, res:Response<any>, next:NextFunction) => {
	try{
		if(passWithoutToken(req.url)) 
			return next();
		const token = req.headers['authorization'];
		jwt.verify(token!, ENV_SETUP.SECRET_KEY_TOKEN!);
		next();
	}catch(error:any){
		next(error);
	}
}
export const tokenProfile = (req: Request<any>, res: Response<any>, next: NextFunction) => {
	try{
		if(passWithoutToken(req.url) || passWithoutTokenProfile(req.url))
			return next();
		const token: string = req.headers['authorization']!;
		decodeTokenLogProfile(token);
		next();
	}catch(error: any){
		next(error);
	}
}
export const isTokenOfAuthenticate = (req: Request<any>, res: Response<any>, next: NextFunction)=>{
	try{
		const queries = req.query;
		const token = decodeTokenAuthentication(queries.token as string)?.idUser;
		if(!token)
			throw new JsonWebTokenError("Don't have enough permission, authenticate's token");
		next();
	}catch(error:any){
		next(error);
	}
}
export const isTokenOfPassword = (req: Request<any>, res: Response<any>, next: NextFunction)=>{
	try{
		const token = req.headers['authorization'];
		if(!token)
			throw new JsonWebTokenError("Don't have enough permission, password's token");
		next();
	}catch(error:any){
		next(error);
	}
}
const passWithoutToken = (url: string): boolean => {
	const endPointsWithoutToken: string[] = [
		'/api/user/login',
		'/api/user/register',
		'/api/user/request',
		'/api/layout'
	];
	return endPointsWithoutToken.some((endPoint) => url.includes(endPoint));
}
const passWithoutTokenProfile = (url: string): boolean => {
	const endPointsWithoutToken: string[] = [
		'/api/profile/get-all',
		'/api/profile/log-in',
		'/api/profile/add',
	];
	return endPointsWithoutToken.some((endPoint) => url.includes(endPoint));
}