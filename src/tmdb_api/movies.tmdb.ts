import { Movies } from "../api/movies.api";

export const getMovieById = async (idMovie: number | string ):Promise<any> => {
	return await (await fetch(`${process.env.API_TMDB}/movie/${idMovie}?language=US`, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${process.env.TOKEN_TMDB}`,
		}
	})).json();
}

export const getMoviePopular = async (page: number | string = 1) => {
	return await (await fetch(
		`${process.env.API_TMDB}/movie/now_playing?language=US&page=${page}`,
		{
			method: "GET",
			headers: {
				Authorization: `Bearer ${process.env.TOKEN_TMDB}`,
			},
		}
	)).json();
};

export const getSimilarMovie = async (idMovie: number | string) => {
	return await ( await fetch(
		`${process.env.API_TMDB}/movie/${idMovie}/similar?language=US&page=1`,
		{
			method: "GET",
			headers: {
				Authorization: `Bearer ${process.env.TOKEN_TMDB}`,
			},
		}
	)).json();
}

export const getMoviesByTitle = async (title: string): Promise<Movies> => {
		return await ( await fetch(
			`${process.env.API_TMDB}/search/movie?query=${title}&include_adult=false&language=en-US&page=1`,
			{
				method: "GET",
				headers: {
					Authorization: `Bearer ${process.env.TOKEN_TMDB}`,
				},
			}
		)).json();
	}