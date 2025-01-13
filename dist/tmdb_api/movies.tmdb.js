"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMoviesByTitle = exports.getSimilarMovie = exports.getMoviePopular = exports.getMovieById = void 0;
const getMovieById = async (idMovie) => {
    return await (await fetch(`${process.env.API_TMDB}/movie/${idMovie}?language=US`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${process.env.TOKEN_TMDB}`,
        }
    })).json();
};
exports.getMovieById = getMovieById;
const getMoviePopular = async (page = 1) => {
    return await (await fetch(`${process.env.API_TMDB}/movie/now_playing?language=US&page=${page}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${process.env.TOKEN_TMDB}`,
        },
    })).json();
};
exports.getMoviePopular = getMoviePopular;
const getSimilarMovie = async (idMovie) => {
    return await (await fetch(`${process.env.API_TMDB}/movie/${idMovie}/similar?language=US&page=1`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${process.env.TOKEN_TMDB}`,
        },
    })).json();
};
exports.getSimilarMovie = getSimilarMovie;
const getMoviesByTitle = async (title) => {
    return await (await fetch(`${process.env.API_TMDB}/search/movie?query=${title}&include_adult=false&language=en-US&page=1`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${process.env.TOKEN_TMDB}`,
        },
    })).json();
};
exports.getMoviesByTitle = getMoviesByTitle;
