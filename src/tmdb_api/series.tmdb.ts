import axios from "axios";
import { ENV_SETUP } from "../config/variables.config";

const instance = axios.create({
	baseURL: `${ENV_SETUP.API_TMDB}`,
	headers: {
		Authorization: `Bearer ${ENV_SETUP.TOKEN_TMDB}`,
	},
});
instance.interceptors.response.use(
	function(response:any){
		return response.data;
	},
	function (error) {
		return error;
	}
)
export const getSerieById = async (idSerie: number | string): Promise<any> => {
	return instance.get<any>(`/tv/${idSerie}?language=US`);
};
export const getSerieWithExtras = async (idSerie: number | string) => {
	return instance.get<any>(`/tv/${idSerie}?append_to_response=videos%2Cimages%2Ccredits%2Csimilar%2Crecommendations&language=en-US`);
}
export const getSerieWithRecommendationById = async (idSerie: number | string):Promise<any> => {
	return instance.get<any>(`/tv/${idSerie}?append_to_response=recommendations&language=US`);
}
export const getRecommendationBySerie = async (idSerie: number | string): Promise<any> => {
	return instance.get<any>(`/tv/${idSerie}/recommendations?language=US`);
}
export const getSeriesPopular = async (page: number | string = 1): Promise<any> => {
	return instance.get<any>(`/tv/popular?language=US&page=${page}`);
};
export const getSeriesAiringToday = async (page: number | string = 1): Promise<any> => {
	return instance.get<any>(`/tv/airing_today?language=US&page=${page}`);
}
export const getSimilarSeries = async (idSerie: number | string): Promise<any> => {
	return instance.get<any>(`/tv/${idSerie}/similar?language=US`);
};
export const getSeriesByTitle = async (title: string): Promise<any> => {
	return instance.get<any>(`/search/tv?language=US&query=${title}`);
};
