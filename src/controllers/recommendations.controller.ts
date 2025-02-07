import { Request, Response } from "express";
import { decodeJwt } from "../middleware/authentication.middleware";
import sequelize from "../db/connection";
import { ErrorControl } from "../error/error-handling";
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

export const getRecommendations = async (req: Request, resp: Response) => {
	try {
		const [query]: any = await sequelize.query(
			`
				CALL get_rec();
			`,
			{
				type: QueryTypes.SELECT,
			}
		);
		const resultEndPoint = {
			results: await embeddingRecommendationsGlobal(Object.values(query))
		}
		resp.status(200).json(resultEndPoint);
	} catch (error) {
		const { code, msg } = ErrorControl(error);
		resp.status(code).json({ msg });
	}
};
export const getRecommendationsByProfile = async (
	req: Request,
	resp: Response
) => {
	try {
		const { idProfile: profile_id } = decodeJwt(req.headers["authorization"]!);
		const [data]: any = await sequelize.query(
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
		const resultEndPoint = {
			last_viewed: data["0"].last_viewed ? await embeddingLastViewedByProfile(data["0"].last_viewed) : null,
			recommendations: await embeddingRecommendationsByProfile(data["0"].recommendations),
		};
		resp.status(200).json(resultEndPoint);
	} catch (error) {
		const { code, msg } = ErrorControl(error);
		resp.status(code).json({ msg });
	}
};
const embeddingRecommendationsGlobal = async (recommendations: any[]): Promise<any> => {
	if(!recommendations.length)
		return (await getMoviesPopular()).results;
	return Promise.all(
		recommendations.map(async (item: any) => {
			if (item.type == 'M') 
				return getMovieById(item.item_id);
			return getSerieById(item.item_id);
		})
	);
};
const embeddingLastViewedByProfile = async (lastViewed: any): Promise<any> => {
	if(lastViewed.type == 'M')
		return getMovieWithExtras(lastViewed.item_id);
	return getSerieWithExtras(lastViewed.item_id);
};
const embeddingRecommendationsByProfile = async (recommendations: any[]): Promise<any> => {
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
	if(!recommendations) recommendations = [];
	recommendations = recommendations.map((item: any) => {
		if (item.type == "M") return getRecommendationByMovie(item.item_id);
		return getRecommendationBySerie(item.item_id);
	});
	while (recommendations.length < recommendationsDefault.length) {
		recommendations.push(recommendationsDefault[pointer]);
		pointer++;
	}
	return recommendations;
}
