import { Request, Response } from "express";
import ScoreSeries from "../models/score_series.model";
import sequelize from "../db/connection";

export const addNewReviewOfSerie = async (req: Request, resp: Response) => {
	try {
		const {body} = req;
		await ScoreSeries.create(body);
		resp.status(200).json({
			msg: "Review created"
		});
	} catch (err) {
		resp.status(400).json({
			msg: "There was a problem"
		})
	}
}
export const getReviewOfSerie = async (req: Request, resp: Response) =>{
	try {
		const {idSerie} = req.params;
		const [data, metadata] = await sequelize.query(`
				SELECT score_series.*, profiles.name FROM score_series
				JOIN profiles ON profiles.id = score_series.profile_id
				AND score_series.serie_id = :idSerie
			`, {
				replacements: {
					idSerie
				}
			});
			resp.status(200).json(data);
	} catch (err) {
		resp.status(400).json({
			msg: "There was a problem"
		})
	}
}