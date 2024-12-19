"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllSeriesOfProfile = void 0;
const profile_series_model_1 = __importDefault(require("../models/profile_series.model"));
const getAllSeriesOfProfile = async (req, resp) => {
    try {
        const { idProfile } = req.body;
        await profile_series_model_1.default.findAll({ where: {
                idProfile: idProfile
            } }).then((data) => {
            resp.status(200).json({
                msg: 'Find your profile',
                data: data
            });
        });
    }
    catch (err) {
        resp.status(400).json({
            msg: 'Not find profile',
        });
    }
};
exports.getAllSeriesOfProfile = getAllSeriesOfProfile;
