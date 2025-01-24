import { Request, Response } from "express";
import ProfileMovies from "../models/profile_movies.model";
import { getMovieById } from "../tmdb_api/movies.tmdb";
import {
	ErrorControl
} from "../error/error-handling";
import sequelize from "../db/connection";
import { decodeJwt } from "../middleware/authentication.middleware";

export const addFavoriteMovie = async (req: Request, resp: Response) => {
	try {
		const { idMovie: movie_id } = req.body;
		if (!movie_id) throw new Error("sintax_error");
		const { idProfile: profile_id } = decodeJwt(req.headers["authorization"]!);
		const [data, metadata]: [any, unknown] = await sequelize.query(
			`
			CALL add_movie(:profile_id, :movie_id);
			`,
			{
				replacements: {
					profile_id,
					movie_id
				}
			}
		);
		resp.status(201).json({
			msg: "Movie added",
			id: data.id,
			goal: data?.goal
		});
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
				profile_id,
				is_delete: 0,
			},
		});
		const results = await Promise.all(
			moviesId.map(async (movie) => {
				return await getMovieById(movie.dataValues.movie_id);
			})
		);
		resp.status(200).json({ results });
	} catch (error: any) {
		const { code, msg } = ErrorControl(error)
		resp.status(code).json({ msg });
	}
};

export const getMovieByProfile = async (req: Request, resp: Response) => {
	try {
		const { idMovie: movie_id } = req.params;
		const { idProfile: profile_id } = decodeJwt(req.headers["authorization"]!);
		await sequelize.query(
			`
			CALL add_log_views(:profile_id, :movie_id, 'M');
			`, {
				replacements: {
					profile_id,
					movie_id
				}
			}
		);
		const movieId = await ProfileMovies.findOne({
			attributes: ["id", "movie_id"],
			where: {
				profile_id,
				movie_id,
				is_delete: 0,
			},
		});
		let results = {}
		if (movieId)
			results = await getMovieById(movieId?.dataValues.movie_id);
		resp.status(200).json({ id: movieId?.dataValues.id, results });
	} catch (error: any) {
		const { code, msg } = ErrorControl(error);
		resp.status(code).json({ msg });
	}
};
export const deleteFavoriteMovie = async (req: Request, resp: Response) => {
	try {
		const { id } = req.params;
		const { idProfile: profile_id } = decodeJwt(req.headers["authorization"]!);
		const [data, metadata]: [any[], unknown] = await sequelize.query(
			`
			SELECT * FROM profile_movies WHERE id = :id AND profile_id = :profile_id
			`,
			{
				replacements: {
					id,
					profile_id
				},
			}
		);
		if (!data.length || !data.find((item) => item.id == id))
			throw new Error("not_find");
		await ProfileMovies.update({ is_delete: 1 }, { where: { id } });
		resp.status(200).json({
			msg: "delete successful",
		});
	} catch (error: any) {
		const { code, msg } = ErrorControl(error);
		resp.status(code).json({ msg });
	}
};
