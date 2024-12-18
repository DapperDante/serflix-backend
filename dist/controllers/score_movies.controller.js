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
exports.getReviewOfMovie = exports.addNewReview = void 0;
const score_movies_model_1 = __importDefault(require("../models/score_movies.model"));
const connection_1 = __importDefault(require("../db/connection"));
const addNewReview = (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { body } = req;
        yield score_movies_model_1.default.create(body);
        resp.status(200).json({
            msg: "Review created"
        });
    }
    catch (err) {
        resp.status(400).json({
            msg: "A has an problem"
        });
    }
});
exports.addNewReview = addNewReview;
const getReviewOfMovie = (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { idMovie } = req.params;
        const [data, metadata] = yield connection_1.default.query(`
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
            msg: "A has an problem"
        });
    }
});
exports.getReviewOfMovie = getReviewOfMovie;
