import { Request, Response } from "express";
import { getDataToSearch } from "../IA/search.IA";
import {
	ErrorControl
} from "../error/error-handling";
import { getMoviesByTitle } from "../tmdb_api/movies.tmdb";
import { getSeriesByTitle } from "../tmdb_api/series.tmdb";
export const searchGlobal = async (req: Request, resp: Response) => {
	try {
		const { query, times, manyItemsRelation } = req.query;
		if (!(query && times && manyItemsRelation)) throw new Error("sintax_error");
		const movies = await getMoviesByTitle(query.toString());
		const series = await getSeriesByTitle(query.toString());
		//if query doesn't match to one title, so it has research for all movies until get movies to nearest match to thit query
		if (!(movies.results.length || series.results.length)) {
			//the parameters is to calibrate how many values returned or how many values research
			const results = await getDataToSearch(
				query,
				Number(times),
				Number(manyItemsRelation)
			);
			resp
				.status(200)
				.json({ results, total_pages: 1, total_results: results.length });
			return;
		}
		if(movies.results.length){
			movies.results.map((movie: any) => {
				movie.type = "movie";
				return movie;
			});
		}
		if(series.results.length){
			series.results.map((serie: any) => {
				serie.type = "serie";
				return serie;
			});
		}
		resp.status(200).json({results: [...movies.results, ...series.results], total_pages: Math.max(movies.total_pages, series.total_pages), total_results: movies.total_results + series.total_results});
	} catch (error: any) {
		const { code, msg } = ErrorControl(error);
		resp.status(code).json({ msg });
	}
};
