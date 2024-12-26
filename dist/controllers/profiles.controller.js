"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfile = exports.getAllProfiles = exports.addNewProfile = void 0;
const profiles_model_1 = __importDefault(require("../models/profiles.model"));
const connection_1 = __importDefault(require("../db/connection"));
const addNewProfile = async (req, resp) => {
    try {
        const { body } = req;
        await profiles_model_1.default.create(body);
        resp.status(200).json({
            msg: 'profile created'
        });
    }
    catch (error) {
        //For get state of sql you need to use error.original.sqlState to method controlOfErrors
        resp.status(400).json({
            msg: "Fail to create user"
        });
    }
};
exports.addNewProfile = addNewProfile;
const getAllProfiles = async (req, resp) => {
    try {
        const { idUser } = req.params;
        await profiles_model_1.default.findAll({ where: {
                user_id: idUser
            } }).then(data => {
            resp.status(200).json(data);
        });
    }
    catch (err) {
        resp.status(404).json({
            msg: "Not find your profiles"
        });
    }
};
exports.getAllProfiles = getAllProfiles;
const getProfile = async (req, resp) => {
    try {
        const { idProfile } = req.params;
        console.log(idProfile);
        const [data, metadata] = await connection_1.default.query(`
			SELECT profiles.name, profiles.img, (
				SELECT group_concat(movies.movie_id) FROM profile_movies AS movies WHERE movies.is_delete = 0 AND movies.profile_id = :idProfile
			) AS movies, (
				SELECT group_concat(series.serie_id) FROM profile_series AS series WHERE series.is_delete = 0 AND series.profile_id = :idProfile
			) AS series FROM profiles WHERE profiles.id = :idProfile;
		`, {
            replacements: {
                idProfile
            }
        });
        console.log(data);
        const result = {
            name: data[0].name,
            img: data[0].img,
            movies: data[0].movies ? data[0].movies.split(',').map(Number) : [],
            series: data[0].series ? data[0].series.split(',').map(Number) : []
        };
        console.log(result);
        resp.status(200).json(result);
    }
    catch (err) {
        console.log(err);
        resp.status(400).json({
            msg: "There was a problem"
        });
    }
};
exports.getProfile = getProfile;
