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
exports.update = exports.create = exports.deleteById = exports.getByUidAndIdProfile = exports.getById = exports.getAll = void 0;
const favorite_series_1 = __importDefault(require("../models/favorite-series"));
const getAll = (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    const favorites = yield favorite_series_1.default.findAll();
    resp.json(favorites);
});
exports.getAll = getAll;
const getById = (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const favorite = yield favorite_series_1.default.findByPk(id);
        resp.status(200).json(favorite);
    }
    catch (error) {
        resp.status(404).json({
            msg: 'not find your request'
        });
    }
});
exports.getById = getById;
const getByUidAndIdProfile = (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { uid, idProfile } = req.query;
        const favorite = yield favorite_series_1.default.findAll({
            where: {
                uid,
                idProfile
            }
        });
        resp.status(200).json(favorite);
    }
    catch (error) {
        resp.status(404).json({
            msg: 'Not find your request'
        });
    }
});
exports.getByUidAndIdProfile = getByUidAndIdProfile;
const deleteById = (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const favorite = yield favorite_series_1.default.findByPk(id);
        if (!favorite)
            throw new Error();
        favorite.destroy();
        resp.status(200).json({
            msg: 'Sucessful delete'
        });
    }
    catch (error) {
        resp.status(404).json({
            msg: "Can't delete your request"
        });
    }
});
exports.deleteById = deleteById;
const create = (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { body } = req;
        yield favorite_series_1.default.create(body);
        resp.status(200).json({
            msg: "Add serie favorite"
        });
    }
    catch (error) {
        resp.status(500).json({
            msg: "Can't add serie favorite"
        });
    }
});
exports.create = create;
const update = (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("i'm here");
        const { body } = req;
        const { id } = req.params;
        const favorite = yield favorite_series_1.default.findByPk(id);
        if (!favorite) {
            resp.status(404).json({
                msg: "Not found your serie favorite"
            });
            return;
        }
        favorite.update(body);
        resp.status(200).json({
            msg: "Sucessful update to serie favorite"
        });
    }
    catch (error) {
        resp.status(500).json({
            msg: "Can't do your request, syntax error"
        });
    }
});
exports.update = update;
