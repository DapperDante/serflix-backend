import { Movies } from "../api/movies.api";

export const getMovieById = async (idMovie: number | string ) => {
	return await (await fetch(`${process.env.API_TMDB}/movie/${idMovie}?language=US`, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${process.env.TOKEN_TMDB}`,
		}
	})).json();

}
export const getSeriesById = async (idSerie: number | string ): Promise<any> => { 
	return (await fetch(`${process.env.API_TMDB}/tv/${idSerie}?language=US`, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${process.env.TOKEN_TMDB}`,
		}
	})).json();
}
export const getMoviePopular = async (page: number | string = 1) => {
	let data: Movies;
	await fetch(
		`${process.env.API_TMDB}/movie/now_playing?language=US&page=${page}`,
		{
			method: "GET",
			headers: {
				Authorization: `Bearer ${process.env.TOKEN_TMDB}`,
			},
		}
	).then(async (movies) => {
		data = await movies.json();
	});
	data!.results = data!.results.filter(movie=>movie.poster_path);
	return data!;
};
export const getSimilarMovie = async (idMovie: number | string) => {
	let data: Movies;
	await fetch(
		`${process.env.API_TMDB}/movie/${idMovie}/similar?language=US&page=1`,
		{
			method: "GET",
			headers: {
				Authorization: `Bearer ${process.env.TOKEN_TMDB}`,
			},
		}
	).then(async (value) => {
		data = await value.json();
	});
	data!.results = data!.results.filter(movie=>movie.poster_path);
	return data!;
}