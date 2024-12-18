"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../db/connection"));
const profiles_model_1 = __importDefault(require("./profiles.model"));
const ProfileMovies = connection_1.default.define('profile_series', {
    profile_id: {
        type: sequelize_1.DataTypes.NUMBER,
        allowNull: false,
        references: {
            model: profiles_model_1.default,
            key: 'id'
        }
    },
    serie_id: {
        type: sequelize_1.DataTypes.NUMBER,
        allowNull: false
    }
}, {
    createdAt: false,
    updatedAt: false
});
exports.default = ProfileMovies;
