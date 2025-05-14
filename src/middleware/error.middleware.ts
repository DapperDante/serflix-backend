import { NextFunction, Request, Response } from "express";
import { PasswordError, PermissionDeniedError, QueryError, SpError, SyntaxError } from "../error/errors";
import { JsonWebTokenError } from "jsonwebtoken";

export const errorHandling = (err: any, req: Request<any>, res: Response<any>, next: NextFunction) =>{
	let status;
	let msg;
	console.error(err);
	if(err instanceof PermissionDeniedError){
		status = 403;
		msg = err.message;
	}
	else if(err instanceof SyntaxError){
		status = 400;
		msg = err.message;
	}
	else if(err instanceof SpError){
		status = 400;
		msg = err.message;
	}
	else if(err instanceof PasswordError){
		status = 401;
		msg = err.message;
	}
	else if(err instanceof JsonWebTokenError){
		status = 403;
		msg = err.message;
	}
	else if(err instanceof QueryError){
		status = 403;
		msg = err.message;
	}
	else {
		status = 500;
		msg = "Internal Server";
	}
	res.status(status).json({msg});
}