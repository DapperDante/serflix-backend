"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDataToSearch = void 0;
const tf = __importStar(require("@tensorflow/tfjs-node"));
const encoder = __importStar(require("@tensorflow-models/universal-sentence-encoder"));
tf.setBackend('tensorflow');
//Those function is only mathematic operations to tensor's universal-sentence-encoder
const zipWith = (f, xs, ys) => {
    const ny = ys.length;
    return (xs.length <= ny ? xs : xs.slice(0, ny)).map((x, i) => f(x, ys[i]));
};
const dotProduct = (xs, ys) => {
    const sum = (xs) => xs ? xs.reduce((a, b) => a + b, 0) : undefined;
    return xs.length === ys.length
        ? sum(zipWith((a, b) => a * b, xs, ys))
        : undefined;
};
//API's TMDB
const getMoviePopular = async (page = 1) => {
    let data;
    await fetch(`${process.env.API_TMDB}/movie/now_playing?language=US&page=${page}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${process.env.TOKEN_TMDB}`,
        },
    }).then(async (movies) => {
        data = await movies.json();
    });
    data.results = data.results.filter(movie => movie.poster_path);
    return data;
};
const getSimilarMovie = async (idMovie) => {
    let data;
    await fetch(`${process.env.API_TMDB}/movie/${idMovie}/similar?language=US&page=1`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${process.env.TOKEN_TMDB}`,
        },
    }).then(async (value) => {
        data = await value.json();
    });
    data.results = data.results.filter(movie => movie.poster_path);
    return data;
};
//This function is when you need only data score without movie's similarities like next function
const getRankedResponses = async (model, query, times, manyRelationMovies) => {
    let movies = [];
    let aux;
    for (let i = 0; i < times; i++) {
        aux = await getMoviePopular(i + 1);
        movies.push(...aux.results);
    }
    const input = {
        queries: [query],
        responses: movies.map((movie) => `The title's movies is ${movie.title} and it's description is ${movie.overview}`),
    };
    let scores = [];
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
        scores = await getRankedResponses(model, query, times + 1, manyRelationMovies);
    }
    scores = scores
        .sort((a, b) => b.score - a.score)
        .slice(0, manyRelationMovies);
    // console.log(
    //   scores.map((value) => {
    //     return { response: value.response.title, score: value.score };
    //   })
    // );
    return scores;
};
const getDataToSearch = async (query, times, manyRelationMovies) => {
    const model = await encoder.loadQnA();
    const score = await getRankedResponses(model, query, times, manyRelationMovies);
    let result = score.map((value) => value.response);
    await Promise.all(score.map(async (value) => {
        let aux = await getSimilarMovie(value.response.id);
        result.push(...aux.results);
    }));
    return result;
};
exports.getDataToSearch = getDataToSearch;
