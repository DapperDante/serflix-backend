import sequelize from "../db/connection";
import { NextFunction, Request, Response } from "express";
import { QueryTypes } from "sequelize";
import { SyntaxError } from "../error/errors";
import { spApi } from "../interface/sp.interface";
export const addReviewMovie = async (req: Request, resp: Response, next: NextFunction) => {
	try {
		const {
			idMovie,
			score,
			review,
		} = req.body;
		if(!(idMovie && review))
			throw new SyntaxError("idMovie, score and review are required");
		const { idProfile } = req.user;
		const [query]: any = await sequelize.query(
			`
			CALL add_score_movie(:idProfile, :idMovie, :score, :review);
			`,
			{
				replacements: {
					idProfile,
					idMovie,
					score,
					review
				},
				type: QueryTypes.SELECT
			}
		)
		const resultSp: spApi = query['0'].response;
		if (resultSp.result.error)
			throw new SyntaxError(resultSp.result.error);
		const resultEndPoint = {
			msg: "Review created"
		}
		resp.status(201).json(resultEndPoint);
	} catch (error: any) {
		next(error);
	}
};
export const getReviewsMovie = async (req: Request, resp: Response, next: NextFunction) => {
	try {
		const { id } = req.params;
		const { idProfile } = req.user;
		if (!id) 
			throw new SyntaxError("idMovie is required");
		const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
		const [query]: any = await sequelize.query(
			`
				CALL get_score_movie(:idProfile, :id, :timeZone);
			`,
			{
				replacements: {
					id,
					idProfile,
					timeZone
				},
				type: QueryTypes.SELECT
			}
		);
		const resultSp: spApi = query['0'].response;
		if(resultSp.error_code)
			throw new SyntaxError(resultSp.message);
		const resultEndPoint = {
			its_score: resultSp.result.its_score,
			avg_score: resultSp.result.avg_score,
			scores: resultSp.result.scores,
		}
		resp.status(200).json(resultEndPoint);
	} catch (error: any) {
		next(error);
	}
};
