import { Request, Response } from "express";
import ScoreSeries from "../models/score_series.model";
import sequelize from "../db/connection";
import {
	ErrorControl
} from "../error/error-handling";
import { decodeJwt } from "../middleware/authentication.middleware";
import { QueryTypes } from "sequelize";
export const addReviewSerie = async (req: Request, resp: Response) => {
	try {
		const {
			idSerie: serie_id,
			score,
			review,
		} = req.body;
		if (!(serie_id && score && review))
			throw new Error("sintax_error");
		const {idProfile:profile_id} = decodeJwt(req.headers["authorization"]!);
		await ScoreSeries.create({
			profile_id,
			serie_id,
			score,
			review
		});
		resp.status(201).json({
			msg: "Review created",
		});
	} catch (error: any) {
		const { code, msg } = ErrorControl(error);
		resp.status(code).json({ msg });
	}
};
export const getReviewsSerie = async (req: Request, resp: Response) => {
	try {
		const { idSerie } = req.params;
		const {idProfile} = decodeJwt(req.headers["authorization"]!);
		const [query]: any = await sequelize.query(
			`
				CALL get_score_series(:idProfile, :idSerie);
			`,
			{
				replacements: {
					idProfile,
					idSerie
				},
				type: QueryTypes.SELECT
			}
		);
		const resultEndPoint = {
			review: query['0'].review,
			avg_score: query['0'].avg_score,
			results: query['0'].results
		}
		resp.status(200).json(resultEndPoint);
	} catch (error: any) {
		const { code, msg } = ErrorControl(error);
		resp.status(code).json({ msg });
	}
};
