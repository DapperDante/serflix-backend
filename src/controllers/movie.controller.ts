import { Request, Response } from "express";
import ProfileMovies from "../models/profile_movies.model";
import { getMovieById, getMovieWithExtras } from "../tmdb_api/movies.tmdb";
import {
	ErrorControl
} from "../error/error-handling";
import sequelize from "../db/connection";
import { decodeJwt } from "../middleware/authentication.middleware";
import { QueryTypes } from "sequelize";

export const addFavoriteMovie = async (req: Request, resp: Response) => {
	try {
		const { idMovie } = req.body;
		if (!idMovie) 
			throw new Error("sintax_error");
		const { idProfile } = decodeJwt(req.headers["authorization"]!);
		const [data]: any[] = await sequelize.query(
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
		const resultEndPoint = {
			msg: "Movie added",
			goal: data['0'].goal || null
		}
		resp.status(201).json(resultEndPoint);
	} catch (error: any) {
		const { code, msg } = ErrorControl(error);
		resp.status(code).json({ msg });
	}
};

export const getMoviesByProfile = async (req: Request, resp: Response) => {
	try {
		const { idProfile: profile_id } = decodeJwt(req.headers["authorization"]!);
		const moviesId = await ProfileMovies.findAll({
			attributes: ["movie_id"],
			where: {
				profile_id
			},
		});
		moviesId.map(async (movie) => await getMovieById(movie.dataValues.movie_id));
		const entertaiment = await Promise.all(moviesId);
		const resultEndPoint = {
			results: entertaiment,
		}
		resp.status(200).json(resultEndPoint);
	} catch (error: any) {
		const { code, msg } = ErrorControl(error)
		resp.status(code).json({ msg });
	}
};

export const getMovieByProfile = async (req: Request, resp: Response) => {
	try {
		const { idMovie } = req.params;
		const { idProfile } = decodeJwt(req.headers["authorization"]!);
		const [data]: any[] = await sequelize.query(
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
		let resultEndPoint = {
			result: await getMovieWithExtras(idMovie),
			is_favorite: Object.values(data).length ? true : false
		};
		resp.status(200).json(resultEndPoint);
	} catch (error: any) {
		const { code, msg } = ErrorControl(error);
		resp.status(code).json({ msg });
	}
};
export const deleteFavoriteMovie = async (req: Request, resp: Response) => {
	try {
		const { idMovie:movie_id } = req.params;
		const { idProfile:profile_id } = decodeJwt(req.headers["authorization"]!);
		await ProfileMovies.destroy({
			where: {
				profile_id,
				movie_id,
			}
		});
		resp.status(200).json({
			msg: "delete successful",
		});
	} catch (error: any) {
		const { code, msg } = ErrorControl(error);
		resp.status(code).json({ msg });
	}
};
