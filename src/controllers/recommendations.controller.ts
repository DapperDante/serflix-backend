import { Request, Response } from "express";
import { decodeJwt } from "../middleware/authentication.middleware";
import sequelize from "../db/connection";
import { ErrorControl } from "../error/error-handling";
import { QueryTypes } from "sequelize";
import { getMovieById, getMoviesPopular, getMoviesTopRated, getMovieWithRecommendationById, getRecommendationByMovie } from "../tmdb_api/movies.tmdb";
import { getRecommendationBySerie, getSeriesById, getSerieWithRecommendationById } from "../tmdb_api/series.tmdb";

export const getRecommendations = async (req: Request, resp: Response) => {
	try {
		const [data, metadata] = await sequelize.query(
			`
				CALL get_rec();
			`, {
				type: QueryTypes.SELECT
			}
		);
		const items = Object.values(data);
		let results;
		if(items.length){
			results = {results: await Promise.all(
				items.map(async (item: any) => {
					if(item.type === 'M')
						return await getMovieById(item.item_id);
					return await getSeriesById(item.item_id);	
				})
			)};
		}else{
			results = await getMoviesPopular();
		}
		resp.status(200).json(results);
	} catch (error) {
		const {code, msg} = ErrorControl(error);
		resp.status(code).json({msg});
	}
}
export const getRecommendationsByProfile = async (req: Request, resp: Response) => {
	try {
		const {idProfile: profile_id} = decodeJwt(req.headers["authorization"]!);
		const [data] : any= await sequelize.query(
			`
				CALL get_rec_by_profile(:profile_id);
			`, {
				replacements: {
					profile_id
				},
				type: QueryTypes.SELECT
			}
		);
		const result = data['0'].results;
		if(result.last_viewed){
			result.last_viewed = result.last_viewed.type === 'M' ? 
				await getMovieWithRecommendationById(result.last_viewed.item_id) : 
				await getSerieWithRecommendationById(result.last_viewed.item_id);
		}
		if(result.recommendations){
			result.recommendations = await Promise.all(
				result.recommendations.map(async (item: any) => {
					if(item.type === 'M')
						return await getRecommendationByMovie(item.item_id);
					return await getRecommendationBySerie(item.item_id);	
				})
			);
		}else{
			result.recommendations = [await getMoviesPopular(), await getMoviesTopRated()];
		}
		resp.status(200).json(result);
	} catch (error) {
		const {code, msg} = ErrorControl(error);
		resp.status(code).json({msg});
	}
	
}