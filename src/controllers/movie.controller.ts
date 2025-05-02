import { NextFunction, Request, Response } from "express";
import { getMovieById, getMovieWithExtras } from "../tmdb_api/movies.tmdb";
import { QueryTypes } from "sequelize";
import { decodeTokenLogProfile } from "../config/token.config";
import { spApi } from "../interface/sp.api";
import { SpError, SyntaxError } from "../error/errors";
import sequelize from "../db/connection";

export const addFavoriteMovie = async (req: Request, resp: Response, next: NextFunction) => {
	try {
		const { idMovie } = req.body;
		if (!idMovie) 
			throw new SyntaxError("idMovie is required");
		const { idProfile } = decodeTokenLogProfile(req.headers["authorization"]!);
		const [query]: any[] = await sequelize.query(
			`
			CALL add_movie(:idProfile, :idMovie);
			`,
			{
				replacements: {
					idProfile,
					idMovie
				},
				type: QueryTypes.SELECT,
			}
		);
		const resultSp: spApi = query['0'].response;
		if(resultSp.error_code)
			throw new SpError(resultSp.message);
		const resultEndPoint = {
			msg: "Movie added",
			goal: resultSp.result.goal || null
		}
		resp.status(201).json(resultEndPoint);
	} catch (error: any) {
		next(error);
	}
};

export const getMoviesByProfile = async (req: Request, resp: Response, next: NextFunction) => {
	try {
		const { idProfile } = decodeTokenLogProfile(req.headers["authorization"]!);
		const [query]: any = await sequelize.query(
			`
			CALL get_all_movies(:idProfile);
			`,
			{
				replacements: {
					idProfile
				},
				type: QueryTypes.SELECT
			}
		);
		const resultSp: spApi = query['0'].response;
		if(resultSp.error_code)
			throw new SpError(resultSp.message);
		const moviesId = resultSp.result.map(async (movie: {movie_id: number}) => await getMovieById(movie.movie_id));
		const entertaiment = await Promise.all(moviesId);
		const resultEndPoint = {
			results: entertaiment,
		}
		resp.status(200).json(resultEndPoint);
	} catch (error: any) {
		next(error);
	}
};

export const getMovieByProfile = async (req: Request, resp: Response, next: NextFunction) => {
	try {
		const { idMovie } = req.params;
		const { idProfile } = decodeTokenLogProfile(req.headers["authorization"]!);
		const [query]: any[] = await sequelize.query(
			`
			CALL get_movie(:idProfile, :idMovie);
			`, {
				replacements: {
					idProfile,
					idMovie
				},
				type: QueryTypes.SELECT,
			}
		);
		const resultSp: spApi = query['0'].response;
		if(resultSp.error_code && resultSp.error_code != 1329)
			throw new SpError(resultSp.message);
		let resultEndPoint = {
			result: await getMovieWithExtras(idMovie),
			is_favorite: resultSp.result ? true : false
		};
		resp.status(200).json(resultEndPoint);
	} catch (error: any) {
		next(error);
	}
};
export const deleteFavoriteMovie = async (req: Request, resp: Response, next: NextFunction) => {
	try {
		const { idMovie:movie_id } = req.params;
		const { idProfile:profile_id } = decodeTokenLogProfile(req.headers["authorization"]!);
		// await ProfileMovies.destroy({
		// 	where: {
		// 		profile_id,
		// 		movie_id,
		// 	}
		// });
		resp.status(200).json({
			msg: "delete successful",
		});
	} catch (error: any) {
		next(error);
	}
};
