import sequelize from "../db/connection";
import { NextFunction, Request, Response } from "express";
import { QueryTypes } from "sequelize";
import {
	getMovieById,
	getMoviesNowPlaying,
	getMoviesPopular,
	getMoviesTopRated,
	getMovieWithExtras,
	getRecommendationByMovie,
} from "../tmdb_api/movies.tmdb";
import {
	getRecommendationBySerie,
	getSeriesAiringToday,
	getSerieById,
	getSeriesPopular,
	getSerieWithExtras,
} from "../tmdb_api/series.tmdb";
import { spApi } from "../interface/sp.interface";
import { SpError } from "../error/errors";

export const getRecommendations = async (
	req: Request,
	resp: Response,
	next: NextFunction
) => {
	try {
		const [query]: any = await sequelize.query(
			`
				CALL get_rec();
			`,
			{
				type: QueryTypes.SELECT,
			}
		);
		const resultSp: spApi = query["0"].response;
		if (resultSp.error_code && resultSp.error_code != 1329)
			throw new SpError(resultSp.message);
		const resultEndPoint = {
			results: resultSp.result
				? await embeddingRecommendationsGlobal(resultSp.result)
				: await getMoviesPopular(),
			msg: "recommendations loaded",
		};
		resp.status(200).json(resultEndPoint);
	} catch (error: any) {
		next(error);
	}
};
export const getRecommendationsByProfile = async (
	req: Request,
	resp: Response,
	next: NextFunction
) => {
	try {
		const { idProfile: profile_id } = req.user;
		const [query]: any = await sequelize.query(
			`
				CALL get_rec_by_profile(:profile_id);
			`,
			{
				replacements: {
					profile_id,
				},
				type: QueryTypes.SELECT,
			}
		);
		const resultSp: spApi = query["0"].response;
		if (resultSp.error_code) throw new SpError(resultSp.message);
		const resultEndPoint = {
			last_viewed: resultSp.result.last_viewed
				? await embeddingLastViewedByProfile(resultSp.result.last_viewed)
				: null,
			recommendations: await embeddingRecommendationsByProfile(
				resultSp.result.recommendations
			),
			msg: "recommendations loaded",
		};
		resp.status(200).json(resultEndPoint);
	} catch (error: any) {
		next(error);
	}
};
const embeddingRecommendationsGlobal = async (
	recommendations: any[]
): Promise<any> => {
	if (recommendations.length < 5) {
		recommendations.push(...(await getMoviesPopular()).results);
	}
	return Promise.all(
		recommendations.map(async (item: any) => {
			if (item.type == "M") return getMovieById(item.item_id);
			else if (item.type == "S") return getSerieById(item.item_id);
			return item;
		})
	);
};
const embeddingLastViewedByProfile = async (lastViewed: any): Promise<any> => {
	if (lastViewed.type == "M") return getMovieWithExtras(lastViewed.item_id);
	return getSerieWithExtras(lastViewed.item_id);
};
const embeddingRecommendationsByProfile = async (
	recommendations: any[]
): Promise<any> => {
	return Promise.all(balanceRecommendations(recommendations));
};
const balanceRecommendations = (recommendations: any[]): any[] => {
	let pointer = 0;
	const recommendationsDefault = [
		getMoviesPopular(),
		getMoviesTopRated(),
		getMoviesNowPlaying(),
		getSeriesPopular(),
		getSeriesAiringToday(),
	];
	if (!recommendations) recommendations = [];
	recommendations = recommendations.map((item: any) => {
		if (item.type == "M") return getRecommendationByMovie(item.item_id);
		return getRecommendationBySerie(item.item_id);
	});
	while (recommendations.length < recommendationsDefault.length) {
		recommendations.push(recommendationsDefault[pointer]);
		pointer++;
	}
	return recommendations;
};
