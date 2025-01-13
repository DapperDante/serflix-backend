"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReviewsSerie = exports.addReviewSerie = void 0;
const score_series_model_1 = __importDefault(require("../models/score_series.model"));
const connection_1 = __importDefault(require("../db/connection"));
const error_handling_1 = require("../error/error-handling");
const authentication_middleware_1 = require("../middleware/authentication.middleware");
const addReviewSerie = async (req, resp) => {
    try {
        const { idSerie: serie_id, score, review, } = req.body;
        if (!(serie_id && score && review))
            throw new Error("sintax_error");
        const { idProfile: profile_id } = (0, authentication_middleware_1.decodeJwt)(req.headers["authorization"]);
        await score_series_model_1.default.create({
            profile_id,
            serie_id,
            score,
            review,
        });
        resp.status(200).json({
            msg: "Review created",
        });
    }
    catch (error) {
        const { code, msg } = (0, error_handling_1.ErrorControl)(error);
        resp.status(code).json({ msg });
    }
};
exports.addReviewSerie = addReviewSerie;
const getReviewsSerie = async (req, resp) => {
    try {
        const { idSerie } = req.params;
        if (!idSerie)
            throw new Error("sintax_error");
        const [data, metadata] = await connection_1.default.query(`
				SELECT score_series.*, profiles.name FROM score_series
				JOIN profiles ON profiles.id = score_series.profile_id
				AND score_series.serie_id = :idSerie
			`, {
            replacements: {
                idSerie
            },
        });
        resp.status(200).json(data);
    }
    catch (error) {
        const { code, msg } = (0, error_handling_1.ErrorControl)(error);
        resp.status(code).json({ msg });
    }
};
exports.getReviewsSerie = getReviewsSerie;
