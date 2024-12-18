"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFavoriteMovie = exports.getMovieByIdOfProfile = exports.addFavoriteMovie = exports.getAllMoviesOfProfile = void 0;
const profile_movies_model_1 = __importDefault(require("../models/profile_movies.model"));
const getAllMoviesOfProfile = (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { idProfile } = req.params;
        yield profile_movies_model_1.default.findAll({ where: {
                profile_id: idProfile,
                is_delete: 0
            } }).then((data) => {
            //For this request need uses other database (TMDB)
            Promise.all(data.map((value) => __awaiter(void 0, void 0, void 0, function* () {
                let auxData;
                yield fetch(`${process.env.API_TMDB}/movie/${value.dataValues.movie_id}?language=en-US`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${process.env.TOKEN_TMDB}`
                    }
                }).then(value => {
                    auxData = value.json();
                });
                return auxData;
            }))).then((results) => {
                resp.status(200).json({ results });
            });
        });
    }
    catch (err) {
        resp.status(404).json({
            msg: 'Not find profile'
        });
    }
});
exports.getAllMoviesOfProfile = getAllMoviesOfProfile;
const addFavoriteMovie = (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { body } = req;
        yield profile_movies_model_1.default.findOne({ where: {
                profile_id: body.profile_id,
                movie_id: body.movie_id
            } }).then((value) => __awaiter(void 0, void 0, void 0, function* () {
            if (!value) {
                yield profile_movies_model_1.default.create(body);
                resp.status(200).json({
                    msg: 'Movie added successful'
                });
                return;
            }
            yield profile_movies_model_1.default.update({ is_delete: 0 }, { where: { id: value.dataValues.id } });
            resp.status(200).json({
                msg: "Update movie",
                id: value.dataValues.id
            });
        }));
    }
    catch (err) {
        resp.status(400).json({
            msg: "Has an ocurred problem"
        });
    }
});
exports.addFavoriteMovie = addFavoriteMovie;
const getMovieByIdOfProfile = (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { idProfile, idMovie } = req.params;
        yield profile_movies_model_1.default.findOne({ where: {
                profile_id: idProfile,
                movie_id: idMovie,
                is_delete: 0
            } }).then((value) => {
            resp.status(200).json(value ? { msg: "Find movie", id: value.dataValues.id } : {});
        });
    }
    catch (err) {
        resp.status(400).json({
            msg: "Has an ocurred problem"
        });
    }
});
exports.getMovieByIdOfProfile = getMovieByIdOfProfile;
const deleteFavoriteMovie = (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req === null || req === void 0 ? void 0 : req.params;
        yield profile_movies_model_1.default.update({ is_delete: 1 }, { where: { id } });
        resp.status(200).json({
            msg: "delete successful"
        });
    }
    catch (err) {
        resp.status(400).json({
            msg: "Has and ocurred problem"
        });
    }
});
exports.deleteFavoriteMovie = deleteFavoriteMovie;
