import { Request, Response } from "express";
import ScoreMovies from "../models/score_movies.model";
import sequelize from "../db/connection";
import {
	ErrorControl
} from "../error/error-handling";
import { decodeJwt } from "../middleware/authentication.middleware";
import { QueryTypes } from "sequelize";
export const addReviewMovie = async (req: Request, resp: Response) => {
	try {
		const {
			idMovie: movie_id,
			score,
			review,
		} = req.body;
		if (!(movie_id && score && review))
			throw new Error("sintax_error");
		const { idProfile: profile_id } = decodeJwt(req.headers["authorization"]!);
		await ScoreMovies.create({
			profile_id,
			movie_id,
			score,
			review,
		});
		resp.status(201).json({
			msg: "Review created",
		});
	} catch (error: any) {
		const { code, msg } = ErrorControl(error);
		resp.status(code).json({ msg });
	}
};
export const getReviewsMovie = async (req: Request, resp: Response) => {
	try {
		const { idMovie } = req.params;
		const { idProfile } = decodeJwt(req.headers["authorization"]!);
		if (!idMovie) throw new Error("sintax_error");
		const [query]: any = await sequelize.query(
			`
				CALL get_score_movies(:idProfile, :idMovie);
			`,
			{
				replacements: {
					idMovie,
					idProfile
				},
				type: QueryTypes.SELECT	
			}
		);
		const resultEndPoint = {
			review: query['0'].review,
			avg_score: query['0'].avg_score,
			results: query['0'].results,
		}
		resp.status(200).json(resultEndPoint);
	} catch (error: any) {
		const { code, msg } = ErrorControl(error);
		resp.status(code).json({ msg });
	}
};
