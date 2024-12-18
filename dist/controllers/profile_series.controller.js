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
exports.getAllSeriesOfProfile = void 0;
const profile_series_model_1 = __importDefault(require("../models/profile_series.model"));
const getAllSeriesOfProfile = (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { idProfile } = req.body;
        yield profile_series_model_1.default.findAll({ where: {
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
});
exports.getAllSeriesOfProfile = getAllSeriesOfProfile;
