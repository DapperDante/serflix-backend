import axios from 'axios';

const instance = axios.create({
	baseURL: `${process.env.API_TMDB}`,
	headers: {
		Authorization: `Bearer ${process.env.TOKEN_TMDB}`,
	},
});
instance.interceptors.response.use(
	function (response: any) {
		return response.data;
	},
	function (error) {
		return error;
	}
)
export const getMovieById = async (idMovie: number | string ):Promise<any> => {
	return instance.get<any>(`/movie/${idMovie}?language=US&page=1`);
}
export const getMovieWithRecommendationById = async (idMovie: number | string):Promise<any> => {
	return instance.get<any>(`/movie/${idMovie}?append_to_response=recommendations&language=US`);
}
export const getMovieWithExtras = async (idMovie: number | string):Promise<any> => {
	return instance.get<any>(`/movie/${idMovie}?append_to_response=videos%2Cimages%2Ccredits%2Csimilar%2Crecommendations&language=en-US`);
}
export const getRecommendationByMovie = async (idMovie: number | string):Promise<any> => {
	return instance.get<any>(`/movie/${idMovie}/recommendations?language=US&page=1`);
}
export const getMoviesNowPlaying = async (page: number | string = 1):Promise<any> => {
	return instance.get<any>(`/movie/now_playing?language=US&page=${page}`);
};
export const getMoviesPopular = async (page: number | string = 1):Promise<any> => {	
	return instance.get<any>(`/movie/popular?language=US&page=${page}`);
}
export const getMoviesTopRated = async (page: number | string = 1):Promise<any> => {
	return instance.get<any>(`/movie/top_rated?language=US&page=${page}`);
};
export const getSimilarMovie = async (idMovie: number | string):Promise<any> => {
	return instance.get<any>(`/movie/${idMovie}/similar?language=US&page=1`)
};
export const getMoviesByTitle = async (title: string): Promise<any> => {
	return instance.get<any>(`/search/movie?query=${title}&include_adult=false&language=en-US&page=1`);
};