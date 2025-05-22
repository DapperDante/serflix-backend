import { NextFunction, Request, Response } from "express";
import sequelize from "../db/connection";

export const healthCheck = async (req: Request, resp: Response, next: NextFunction) => {
	try{
		sequelize.query("SELECT 1");
		const resultEndPoint = {
			result: "OK", 
			message: "Server is running",
		}
		resp.status(200).json(resultEndPoint);
	}catch(error: any){
		next(error);
	}
}