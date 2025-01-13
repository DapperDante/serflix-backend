import { Request, Response } from "express";
import ScoreSeries from "../models/score_series.model";
import sequelize from "../db/connection";
import {
	ErrorControl
} from "../error/error-handling";
import { decodeJwt } from "../middleware/authentication.middleware";
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
			review,
		});
		resp.status(200).json({
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
		if (!idSerie) throw new Error("sintax_error");
		const [data, metadata] = await sequelize.query(
			`
				SELECT score_series.*, profiles.name FROM score_series
				JOIN profiles ON profiles.id = score_series.profile_id
				AND score_series.serie_id = :idSerie
			`,
			{
				replacements: {
					idSerie
				},
			}
		);
		resp.status(200).json(data);
	} catch (error: any) {
		const { code, msg } = ErrorControl(error);
		resp.status(code).json({ msg });
	}
};
