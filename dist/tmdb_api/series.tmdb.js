"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSimilarSeries = exports.getSeriesByTitle = exports.getSeriesPopular = exports.getSeriesById = void 0;
const getSeriesById = async (idSerie) => {
    return (await fetch(`${process.env.API_TMDB}/tv/${idSerie}?language=US`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${process.env.TOKEN_TMDB}`,
        },
    })).json();
};
exports.getSeriesById = getSeriesById;
const getSeriesPopular = async (page = 1) => {
    return (await fetch(`${process.env.API_TMDB}/tv/popular?language=US&page=${page}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${process.env.TOKEN_TMDB}`,
        },
    })).json();
};
exports.getSeriesPopular = getSeriesPopular;
const getSeriesByTitle = async (title) => {
    return (await fetch(`${process.env.API_TMDB}/search/tv?language=US&query=${title}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${process.env.TOKEN_TMDB}`,
        },
    })).json();
};
exports.getSeriesByTitle = getSeriesByTitle;
const getSimilarSeries = async (idSerie) => {
    return (await fetch(`${process.env.API_TMDB}/tv/${idSerie}/similar?language=US`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${process.env.TOKEN_TMDB}`,
        },
    })).json();
};
exports.getSimilarSeries = getSimilarSeries;
