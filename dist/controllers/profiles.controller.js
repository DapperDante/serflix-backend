"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfile = exports.getAllProfiles = exports.addNewProfile = void 0;
const profiles_model_1 = __importDefault(require("../models/profiles.model"));
const connection_1 = __importDefault(require("../db/connection"));
const movies_tmdb_1 = require("../tmdb_api/movies.tmdb");
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
        const [data, metadata] = await connection_1.default.query(`
			SELECT profiles.name, profiles.img, (
				SELECT substring_index(group_concat(movies.movie_id), ',', 1) FROM profile_movies AS movies WHERE movies.is_delete = 0 AND movies.profile_id = :idProfile LIMIT 1
			) AS movies, (
				SELECT substring_index(group_concat(series.serie_id), ',', 1) FROM profile_series AS series WHERE series.is_delete = 0 AND series.profile_id = :idProfile LIMIT 1
			) AS series FROM profiles WHERE profiles.id = :idProfile;
		`, {
            replacements: {
                idProfile
            }
        });
        console.log(data);
        let movies;
        let series;
        if (data[0].movies) {
            movies = data[0].movies.split(',').map(function (value) {
                return (0, movies_tmdb_1.getMovieById)(value);
            });
        }
        if (data[0].series) {
            console.log(data[0].series);
            series = data[0].series.split(',').map(function (value) {
                return (0, movies_tmdb_1.getSeriesById)(value);
            });
        }
        //This line of code is to wait for all promises to be resolved
        Promise.all([...movies, ...series]).then((values) => {
            resp.status(200).json({
                name: data[0].name,
                img: data[0].img,
                results: values.map(function (value) {
                    if ('original_title' in value) {
                        return {
                            id: value.id,
                            original_title: value.original_title,
                            poster_path: value.poster_path,
                            type: 'movie'
                        };
                    }
                    return {
                        id: value.id,
                        original_name: value.original_name,
                        poster_path: value.poster_path,
                        type: 'serie'
                    };
                })
            });
        });
    }
    catch (err) {
        console.log(err);
        resp.status(400).json({
            msg: "There was a problem"
        });
    }
};
exports.getProfile = getProfile;
