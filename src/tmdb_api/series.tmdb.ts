export const getSeriesById = async (idSerie: number | string): Promise<any> => {
	return await (
		await fetch(`${process.env.API_TMDB}/tv/${idSerie}?language=US`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${process.env.TOKEN_TMDB}`,
			},
		})
	).json();
};
export const getSerieWithRecommendationById = async (idSerie: number | string):Promise<any> => {
	return await (
		await fetch(`${process.env.API_TMDB}/tv/${idSerie}?append_to_response=recommendations&language=US`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${process.env.TOKEN_TMDB}`,
			},
		})
	).json();
}
export const getRecommendationBySerie = async (idSerie: number | string): Promise<any> => {
	return await (
		await fetch(`${process.env.API_TMDB}/tv/${idSerie}/recommendations?language=US`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${process.env.TOKEN_TMDB}`,
			},
		})
	).json();
}
export const getSeriesPopular = async (
	page: number | string = 1
): Promise<any> => {
	return await(
		await fetch(`${process.env.API_TMDB}/tv/popular?language=US&page=${page}`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${process.env.TOKEN_TMDB}`,
			},
		})
	).json();
};
export const getSeriesByTitle = async (title: string): Promise<any> => {
	return await (
		await fetch(
			`${process.env.API_TMDB}/search/tv?language=US&query=${title}`,
			{
				method: "GET",
				headers: {
					Authorization: `Bearer ${process.env.TOKEN_TMDB}`,
				},
			}
		)
	).json();
};
export const getSimilarSeries = async (
	idSerie: number | string
): Promise<any> => {
	return await(
		await fetch(`${process.env.API_TMDB}/tv/${idSerie}/similar?language=US`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${process.env.TOKEN_TMDB}`,
			},
		})
	).json();
};
