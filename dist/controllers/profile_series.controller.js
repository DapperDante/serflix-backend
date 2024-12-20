"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFavoriteSerie = exports.getOnlyFavoriteSerie = exports.addFavoriteSerie = exports.getAllFavoriteSeriesByProfile = void 0;
const profile_series_model_1 = __importDefault(require("../models/profile_series.model"));
const getAllFavoriteSeriesByProfile = async (req, resp) => {
    try {
        const { idProfile } = req.params;
        await profile_series_model_1.default.findAll({
            where: {
                profile_id: idProfile,
                is_delete: 0,
            },
        }).then((modelSeries) => {
            Promise.all(modelSeries.map(async (modelSerie) => {
                let auxData;
                await fetch(`${process.env.API_TMDB}/tv/${modelSerie.dataValues.serie_id}?language=US`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${process.env.TOKEN_TMDB}`
                    }
                }).then(series => {
                    auxData = series.json();
                });
                return auxData;
            })).then(results => {
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
exports.getAllFavoriteSeriesByProfile = getAllFavoriteSeriesByProfile;
const addFavoriteSerie = async (req, resp) => {
    try {
        const { body } = req;
        await profile_series_model_1.default.findOne({ where: {
                profile_id: body.profile_id,
                serie_id: body.serie_id
            } }).then(async (value) => {
            if (!value) {
                await profile_series_model_1.default.create(body);
                return resp.status(200).json({
                    msg: "Add serie"
                });
            }
            await profile_series_model_1.default.update({ is_delete: 0 }, { where: { id: value.dataValues.id } });
            return resp.status(200).json({
                msg: "Update serie",
                id: value.dataValues.id
            });
        });
    }
    catch (err) {
        resp.status(400).json({
            msg: "Has an ocurred problem"
        });
    }
};
exports.addFavoriteSerie = addFavoriteSerie;
const getOnlyFavoriteSerie = async (req, resp) => {
    try {
        const { idProfile, idSerie } = req.params;
        await profile_series_model_1.default.findOne({ where: {
                profile_id: idProfile,
                serie_id: idSerie,
                is_delete: 0
            } }).then(value => {
            resp.status(200).json(value ? { msg: "Find movie", id: value.dataValues.id } : {});
        });
    }
    catch (error) {
        resp.status(400).json({
            msg: "Has an ocurred problem"
        });
    }
};
exports.getOnlyFavoriteSerie = getOnlyFavoriteSerie;
const deleteFavoriteSerie = async (req, resp) => {
    try {
        const { id } = req.params;
        await profile_series_model_1.default.update({ is_delete: 1 }, { where: { id } });
        resp.status(200).json({
            msg: "delete successful"
        });
    }
    catch (error) {
        resp.status(400).json({
            msg: "Has an ocurred problem"
        });
    }
};
exports.deleteFavoriteSerie = deleteFavoriteSerie;
