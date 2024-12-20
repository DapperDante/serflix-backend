"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReviewOfSerie = exports.addNewReviewOfSerie = void 0;
const score_series_model_1 = __importDefault(require("../models/score_series.model"));
const connection_1 = __importDefault(require("../db/connection"));
const addNewReviewOfSerie = async (req, resp) => {
    try {
        const { body } = req;
        await score_series_model_1.default.create(body);
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
exports.addNewReviewOfSerie = addNewReviewOfSerie;
const getReviewOfSerie = async (req, resp) => {
    try {
        const { idSerie } = req.params;
        const [data, metadata] = await connection_1.default.query(`
				SELECT score_series.*, profiles.name FROM score_series
				JOIN profiles ON profiles.id = score_series.profile_id
				AND score_series.serie_id = :idSerie
			`, {
            replacements: {
                idSerie
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
exports.getReviewOfSerie = getReviewOfSerie;
