import { NextFunction, Request, Response } from "express"
import { PermissionDeniedError } from "../error/errors";
import { decodeToken } from "../security/token";
import { role, tokenBase } from "../interface/token.interface";
//It's to add the data's token to the request and avoid repeat the decodeToken for each endpoint
declare global{
	namespace Express {
		interface Request {
			user: any
		}
	}
}
export const applyRole = (...role: role[]) =>{
	return (req: Request, res: Response, next: NextFunction) =>{
		try{
			const authHeader = req.headers['authorization'];
			const token = authHeader && authHeader.split(" ")[1];
			if(!token)
				throw new PermissionDeniedError("Don't have permission");
			const tokenDecoded: tokenBase = decodeToken(token);
			if(!role.includes(tokenDecoded.role))
				throw new PermissionDeniedError("Don't have enought permission");
			req.user = tokenDecoded;
			next();
		}catch(error: any){
			next(error);
		}
	}
}