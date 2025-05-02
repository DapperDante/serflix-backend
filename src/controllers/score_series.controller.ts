import sequelize from "../db/connection";
import { NextFunction, Request, Response } from "express";
import { QueryTypes } from "sequelize";
import { decodeTokenLogProfile } from "../config/token.config";
import { SpError, SyntaxError } from "../error/errors";
import { spApi } from "../interface/sp.api";
export const addReviewSerie = async (req: Request, resp: Response, next: NextFunction) => {
	try {
		const {
			idSerie: serie_id,
			score,
			review,
		} = req.body;
		if (!(serie_id && score && review))
			throw new SyntaxError("idSerie, score and review are required");
		const {idProfile:profile_id} = decodeTokenLogProfile(req.headers["authorization"]!);
		const [query]: any = await sequelize.query(
			`
			CALL add_score_serie(:profile_id, :serie_id, :score, :review);
			`, {
				replacements: {
					profile_id,
					serie_id,
					score,
					review
				},
				type: QueryTypes.SELECT
			}
		);
		const resultSp: spApi = query['0'].response;
		if(resultSp.error_code)
			throw new SpError(resultSp.message);
		resp.status(201).json({
			msg: "Review created",
		});
	} catch (error: any) {
		next(error);
	}
};
export const getReviewsSerie = async (req: Request, resp: Response, next: NextFunction) => {
	try {
		const { idSerie } = req.params;
		const { idProfile } = decodeTokenLogProfile(req.headers["authorization"]!);
		const [query]: any = await sequelize.query(
			`
				CALL get_score_serie(:idProfile, :idSerie);
			`,
			{
				replacements: {
					idProfile,
					idSerie
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
