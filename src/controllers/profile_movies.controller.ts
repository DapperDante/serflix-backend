import { Request, Response } from "express";
import ProfileMovies from "../models/profile_movies.model";

export const getAllMoviesOfProfile = async (req: Request, resp: Response) => {
	try {
		const { idProfile } = req.params;
		await ProfileMovies.findAll({
			where: {
				profile_id: idProfile,
				is_delete: 0,
			},
		}).then((modelMovies) => {
			//For this request need uses other database (TMDB)
			Promise.all(
				modelMovies.map(async (modelMovie) => {
					let auxData: any;
					await fetch(
						`${process.env.API_TMDB}/movie/${modelMovie.dataValues.movie_id}?language=US`,
						{
							method: "GET",
							headers: {
								Authorization: `Bearer ${process.env.TOKEN_TMDB!}`,
							},
						}
					).then((movies) => {
						auxData = movies.json();
					});
					return auxData;
				})
			).then((results) => {
				resp.status(200).json({ results });
			});
		});
	} catch (err) {
		resp.status(404).json({
			msg: "Not find profile",
		});
	}
};
export const addFavoriteMovie = async (req: Request, resp: Response) => {
	try {
		const { body } = req;
		await ProfileMovies.findOne({
			where: {
				profile_id: body.profile_id,
				movie_id: body.movie_id,
			},
		}).then(async (value) => {
			if (!value) {
				await ProfileMovies.create(body);
				resp.status(200).json({
					msg: "Movie added successful",
				});
				return;
			}
			await ProfileMovies.update(
				{ is_delete: 0 },
				{ where: { id: value.dataValues.id } }
			);
			resp.status(200).json({
				msg: "Update movie",
				id: value.dataValues.id,
			});
		});
	} catch (err) {
		resp.status(400).json({
			msg: "There was a problem",
		});
	}
};
export const getMovieByIdOfProfile = async (req: Request, resp: Response) => {
	try {
		const { idProfile, idMovie } = req.params;
		await ProfileMovies.findOne({
			where: {
				profile_id: idProfile,
				movie_id: idMovie,
				is_delete: 0,
			},
		}).then((value) => {
			if (!value)
				return resp.status(404).json({
					msg: "Not found",
				});
			resp.status(200).json({
				msg: "Found it",
				id: value.dataValues.id,
			});
		});
	} catch (err) {
		resp.status(400).json({
			msg: "There was a problem",
		});
	}
};
export const deleteFavoriteMovie = async (req: Request, resp: Response) => {
	try {
		const { id } = req.params;
		await ProfileMovies.update({ is_delete: 1 }, { where: { id } });
		resp.status(200).json({
			msg: "delete successful",
		});
	} catch (err) {
		resp.status(400).json({
			msg: "There was a problem",
		});
	}
};
