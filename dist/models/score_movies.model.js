"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../db/connection"));
const profiles_model_1 = __importDefault(require("./profiles.model"));
const ScoreMovies = connection_1.default.define('score_movies', {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    profile_id: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: profiles_model_1.default,
            key: 'id'
        },
        allowNull: false
    },
    movie_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    score: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    review: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false
    }
}, {
    createdAt: false,
    updatedAt: false
});
exports.default = ScoreMovies;
