import * as encoder from "@tensorflow-models/universal-sentence-encoder";
import { Movie } from "../interface/movies.interface";
import { getMoviesPopular, getSimilarMovie } from "../tmdb_api/movies.tmdb";
import { getSeriesPopular, getSimilarSeries } from "../tmdb_api/series.tmdb";
import { Serie } from "../interface/series.interface";
interface searchData {
	response: Movie & Serie;
	score: number;
}
//Those function is only mathematic operations to tensor's universal-sentence-encoder
const zipWith = (f: any, xs: any, ys: any) => {
	const ny = ys.length;
	return (xs.length <= ny ? xs : xs.slice(0, ny)).map((x: any, i: any) =>
		f(x, ys[i])
	);
};
const dotProduct = (xs: any, ys: any) => {
	const sum = (xs: any) =>
		xs ? xs.reduce((a: any, b: any) => a + b, 0) : undefined;

	return xs.length === ys.length
		? sum(zipWith((a: any, b: any) => a * b, xs, ys))
		: undefined;
};
//This function is when you need only data score without movie's similarities like next function
const getRankedResponses: any = async (
	model: any,
	query: any,
	times: number,
	manyRelationMovies: number
) => {
	let movies: any[] = [];
	let series: any[] = [];
	let aux;
	// get infomation of series and movies
	for (let i = 0; i < times; i++) {
		aux = await getMoviesPopular(i + 1);
		movies.push(...aux.results);
	}
	for (let i = 0; i < times; i++) {
		aux = await getSeriesPopular(i + 1);
		series.push(...aux.results);
	}
	// get embeddings of query and responses
	const input = {
		queries: [query],
		responses: [
			...movies.map(
				(movie) =>
					`The title's movies is ${movie.title} and it's description is ${movie.overview}`
			),
			...series.map(
				(serie) =>
					`The title's series is ${serie.name} and it's description is ${serie.overview}`
			),
		],
	};
	let scores: searchData[] = [];
	let embeddings = await model.embed(input);
	const inputTensor = embeddings["queryEmbedding"].arraySync()[0];
	const responseTensors = embeddings["responseEmbedding"].arraySync();
	for (let i = 0; i < responseTensors.length; i++) {
		let dotProductResult = dotProduct(inputTensor, responseTensors[i]);
		scores.push({
			response: [...movies, ...series][i],
			score: dotProductResult,
		});
	}
	scores = scores
		.sort((a: searchData, b: searchData) => b.score - a.score)
		.slice(0, manyRelationMovies)
		.map((value: searchData) => {
			value.response.type = 'original_title' in value.response ? 'movie' : 'serie'
			return value;
		});
	return scores;
};

export const getDataOfSearch = async (
	query: any,
	times: number,
	manyRelationMovies: number
) => {
	const model = await encoder.loadQnA();
	const score: searchData[] = await getRankedResponses(
		model,
		query,
		times,
		manyRelationMovies
	);
	let result = score.map((value) => value.response);
	await Promise.all(
		score.map(async (value) => {
			let aux: any;
			if('original_name' in value.response){
				aux = await getSimilarSeries(value.response.id);
				aux.results.map((value:any) => value.type = 'serie');
				result.push(...aux.results);
				return;
			}
			aux = await getSimilarMovie(value.response.id);
			aux.results.map((value:any) => value.type = 'movie');
			result.push(...aux.results);
		})
	);
	return result;
};
