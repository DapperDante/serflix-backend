import { NextFunction, Request, Response } from "express";
import sequelize from "../db/connection";
import { QueryTypes } from "sequelize";
export const posters = async (req: Request, resp: Response, next: NextFunction) =>{
	try{
		const [query]: any = await sequelize.query(
			`
			CALL get_posters();
			`, {
				type: QueryTypes.SELECT
			}
		);
		const resultSp: any = query['0'].response;
		if(resultSp.error_code)
			throw new Error(resultSp.message);
		const resultEndPoint = {
			result: resultSp.result
		}
		resp.status(200).json(resultEndPoint);
	}catch(error: any){
		next(error);
	}
}