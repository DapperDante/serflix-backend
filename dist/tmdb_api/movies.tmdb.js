"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSimilarMovie = exports.getMoviePopular = exports.getSeriesById = exports.getMovieById = void 0;
const getMovieById = async (idMovie) => {
    return await (await fetch(`${process.env.API_TMDB}/movie/${idMovie}?language=US`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${process.env.TOKEN_TMDB}`,
        }
    })).json();
};
exports.getMovieById = getMovieById;
const getSeriesById = async (idSerie) => {
    return (await fetch(`${process.env.API_TMDB}/tv/${idSerie}?language=US`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${process.env.TOKEN_TMDB}`,
        }
    })).json();
};
exports.getSeriesById = getSeriesById;
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
exports.getMoviePopular = getMoviePopular;
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
exports.getSimilarMovie = getSimilarMovie;
