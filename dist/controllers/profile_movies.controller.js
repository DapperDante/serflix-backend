"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFavoriteMovie = exports.getMovieByIdOfProfile = exports.addFavoriteMovie = exports.getAllMoviesOfProfile = void 0;
const profile_movies_model_1 = __importDefault(require("../models/profile_movies.model"));
const getAllMoviesOfProfile = async (req, resp) => {
    try {
        const { idProfile } = req.params;
        await profile_movies_model_1.default.findAll({
            where: {
                profile_id: idProfile,
                is_delete: 0,
            },
        }).then((modelMovies) => {
            //For this request need uses other database (TMDB)
            Promise.all(modelMovies.map(async (modelMovie) => {
                let auxData;
                await fetch(`${process.env.API_TMDB}/movie/${modelMovie.dataValues.movie_id}?language=US`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${process.env.TOKEN_TMDB}`,
                    },
                }).then((movies) => {
                    auxData = movies.json();
                });
                return auxData;
            })).then((results) => {
                resp.status(200).json({ results });
            });
        });
    }
    catch (err) {
        resp.status(404).json({
            msg: "Not find profile",
        });
    }
};
exports.getAllMoviesOfProfile = getAllMoviesOfProfile;
const addFavoriteMovie = async (req, resp) => {
    try {
        const { body } = req;
        await profile_movies_model_1.default.findOne({
            where: {
                profile_id: body.profile_id,
                movie_id: body.movie_id,
            },
        }).then(async (value) => {
            if (!value) {
                await profile_movies_model_1.default.create(body);
                resp.status(200).json({
                    msg: "Movie added successful",
                });
                return;
            }
            await profile_movies_model_1.default.update({ is_delete: 0 }, { where: { id: value.dataValues.id } });
            resp.status(200).json({
                msg: "Update movie",
                id: value.dataValues.id,
            });
        });
    }
    catch (err) {
        resp.status(400).json({
            msg: "There was a problem",
        });
    }
};
exports.addFavoriteMovie = addFavoriteMovie;
const getMovieByIdOfProfile = async (req, resp) => {
    try {
        const { idProfile, idMovie } = req.params;
        await profile_movies_model_1.default.findOne({
            where: {
                profile_id: idProfile,
                movie_id: idMovie,
                is_delete: 0,
            },
        }).then((value) => {
            if (!value)
                return resp.status(404).json({
                    msg: "Not found",
                });
            resp.status(200).json({
                msg: "Found it",
                id: value.dataValues.id,
            });
        });
    }
    catch (err) {
        resp.status(400).json({
            msg: "There was a problem",
        });
    }
};
exports.getMovieByIdOfProfile = getMovieByIdOfProfile;
const deleteFavoriteMovie = async (req, resp) => {
    try {
        const { id } = req.params;
        await profile_movies_model_1.default.update({ is_delete: 1 }, { where: { id } });
        resp.status(200).json({
            msg: "delete successful",
        });
    }
    catch (err) {
        resp.status(400).json({
            msg: "There was a problem",
        });
    }
};
exports.deleteFavoriteMovie = deleteFavoriteMovie;
