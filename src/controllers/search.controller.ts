import { NextFunction, Request, Response } from "express";
import { getDataOfSearch } from "../IA/search.IA";
import { getMoviesByTitle } from "../tmdb_api/movies.tmdb";
import { getSeriesByTitle } from "../tmdb_api/series.tmdb";
import { SyntaxError } from "../error/errors";
export const searchGlobal = async (req: Request, resp: Response, next: NextFunction) => {
	try {
		const { query, times, itemsRelation } = req.query;
		if (!(query && times && itemsRelation)) 
			throw new SyntaxError("query, times and manyItemsRelation are required");
		const movies = await getMoviesByTitle(query.toString());
		const series = await getSeriesByTitle(query.toString());
		//if query doesn't match to one title, so it has research for all movies until get movies to nearest match to thit query
		let resultOfSearch: any[] = [];
		if (!(movies.total_results || series.total_results)) {
			//the parameters is to calibrate how many values returned or how many values research
			resultOfSearch = await getDataOfSearch(
				query,
				Number(times),
				Number(itemsRelation)
			);
		}
		movies.results.map((movie: any) => {
			movie.type = "movie";
			return movie;
		});
		series.results.map((serie: any) => {
			serie.type = "serie";
			return serie;
		});
		const resultEndPoint = {
			total_pages: Math.max(movies.total_pages, series.total_pages),
			total_results: movies.total_results + series.total_results + resultOfSearch.length,
			results: [...movies.results, ...series.results, ...resultOfSearch],
		};
		resp.status(200).json(resultEndPoint);
	} catch (error: any) {
		next(error);
	}
};
