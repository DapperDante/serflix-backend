"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../db/connection"));
const profiles_model_1 = __importDefault(require("./profiles.model"));
const ScoreSeries = connection_1.default.define('score_series', {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    profile_id: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: profiles_model_1.default,
            key: 'id'
        }
    },
    serie_id: {
        type: sequelize_1.DataTypes.INTEGER
    },
    score: {
        type: sequelize_1.DataTypes.TINYINT
    },
    review: {
        type: sequelize_1.DataTypes.INTEGER
    }
}, {
    createdAt: false,
    updatedAt: false,
    omitNull: false
});
exports.default = ScoreSeries;
