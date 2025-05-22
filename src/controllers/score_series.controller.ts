import sequelize from "../db/connection";
import { NextFunction, Request, Response } from "express";
import { QueryTypes } from "sequelize";
import { SpError, SyntaxError } from "../error/errors";
import { spApi } from "../interface/sp.interface";
export const addReviewSerie = async (req: Request, resp: Response, next: NextFunction) => {
	try {
		const {
			idSerie,
			score,
			review,
		} = req.body;
		if (!(idSerie && score && review))
			throw new SyntaxError("idSerie, score and review are required");
		const {idProfile} = req.user;
		const [query]: any = await sequelize.query(
			`
			CALL add_score_serie(:idProfile, :idSerie, :score, :review);
			`, {
				replacements: {
					idProfile,
					idSerie,
					score,
					review
				},
				type: QueryTypes.SELECT
			}
		);
		const resultSp: spApi = query['0'].response;
		if(resultSp.error_code)
			throw new SpError(resultSp.message);
		const resultEndPoint = {
			msg: "Review created"
		}
		resp.status(201).json(resultEndPoint);
	} catch (error: any) {
		next(error);
	}
};
export const getReviewsSerie = async (req: Request, resp: Response, next: NextFunction) => {
	try {
		const { id } = req.params;
		const { idProfile } = req.user;
		const [query]: any = await sequelize.query(
			`
				CALL get_score_serie(:idProfile, :id);
			`,
			{
				replacements: {
					idProfile,
					id
				},
				type: QueryTypes.SELECT
			}
		);
		const resultSp: spApi = query['0'].response;
		if(resultSp.error_code)
			throw new SpError(resultSp.message);
		const resultEndPoint = {
			its_score: resultSp.result.its_score,
			avg_score: resultSp.result.avg_score,
			scores: resultSp.result.scores
		}
		resp.status(200).json(resultEndPoint);
	} catch (error: any) {
		next(error);
	}
};
