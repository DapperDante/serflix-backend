export const getSeriesById = async (idSerie: number | string): Promise<any> => {
	return (
		await fetch(`${process.env.API_TMDB}/tv/${idSerie}?language=US`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${process.env.TOKEN_TMDB}`,
			},
		})
	).json();
};
export const getSeriesPopular = async (
	page: number | string = 1
): Promise<any> => {
	return (
		await fetch(`${process.env.API_TMDB}/tv/popular?language=US&page=${page}`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${process.env.TOKEN_TMDB}`,
			},
		})
	).json();
};
export const getSeriesByTitle = async (title: string): Promise<any> => {
	return (
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
	return (
		await fetch(`${process.env.API_TMDB}/tv/${idSerie}/similar?language=US`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${process.env.TOKEN_TMDB}`,
			},
		})
	).json();
};
