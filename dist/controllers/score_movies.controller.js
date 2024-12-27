"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReviewOfMovie = exports.addNewReviewOfMovie = void 0;
const score_movies_model_1 = __importDefault(require("../models/score_movies.model"));
const connection_1 = __importDefault(require("../db/connection"));
const addNewReviewOfMovie = async (req, resp) => {
    try {
        const { body } = req;
        await score_movies_model_1.default.create(body);
        resp.status(200).json({
            msg: "Review created"
        });
    }
    catch (err) {
        resp.status(400).json({
            msg: "There was a problem"
        });
    }
};
exports.addNewReviewOfMovie = addNewReviewOfMovie;
const getReviewOfMovie = async (req, resp) => {
    try {
        const { idMovie } = req.params;
        const [data, metadata] = await connection_1.default.query(`
            SELECT score_movies.*, profiles.name FROM score_movies 
            JOIN profiles ON profiles.id = score_movies.profile_id 
            AND score_movies.movie_id = :idMovie`, {
            replacements: {
                idMovie
            }
        });
        resp.status(200).json(data);
    }
    catch (err) {
        resp.status(400).json({
            msg: "There was a problem"
        });
    }
};
exports.getReviewOfMovie = getReviewOfMovie;
