import * as tf from "@tensorflow/tfjs-node";
import * as encoder from "@tensorflow-models/universal-sentence-encoder";
import { Movie, Movies } from "../api/movies.api";
tf.setBackend('tensorflow');
interface searchData {
  response: Movie;
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
//API's TMDB
const getMoviePopular: any = async (page: number | string = 1) => {
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
const getSimilarMovie: any = async (idMovie: number | string) => {
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
};
//This function is when you need only data score without movie's similarities like next function
const getRankedResponses: any = async (
  model: any,
  query: any,
  times: number,
  manyRelationMovies: number
) => {
  let movies: any[] = [];
  let aux;
  for (let i = 0; i < times; i++) {
    aux = await getMoviePopular(i + 1);
    movies.push(...aux.results);
  }
  const input = {
    queries: [query],
    responses: movies.map(
      (movie) =>
        `The title's movies is ${movie.title} and it's description is ${movie.overview}`
    ),
  };
  let scores: searchData[] = [];
  let embeddings = await model.embed(input);
  const inputTensor = embeddings["queryEmbedding"].arraySync()[0];
  const responseTensors = embeddings["responseEmbedding"].arraySync();
  for (let i = 0; i < responseTensors.length; i++) {
    let dotProductResult = dotProduct(inputTensor, responseTensors[i]);
    scores.push({
      response: movies[i],
      score: dotProductResult,
    });
  }
  if (!scores.length) {
    scores = await getRankedResponses(
      model,
      query,
      times + 1,
      manyRelationMovies
    );
  }
  scores = scores
    .sort((a: searchData, b: searchData) => b.score - a.score)
    .slice(0, manyRelationMovies);
  // console.log(
  //   scores.map((value) => {
  //     return { response: value.response.title, score: value.score };
  //   })
  // );
  return scores;
};

export const getDataToSearch = async (
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
  let result: Movie[] = score.map((value) => value.response);
  await Promise.all(
    score.map(async (value) => {
      let aux = await getSimilarMovie(value.response.id);
      result.push(...aux.results);
    })
  );
  return result;
};
