"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../db/connection"));
const profiles_model_1 = __importDefault(require("./profiles.model"));
const ProfileSeries = connection_1.default.define('profile_series', {
    id: {
        type: sequelize_1.DataTypes.NUMBER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
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
    },
    is_delete: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 0
    }
}, {
    createdAt: false,
    updatedAt: false
});
exports.default = ProfileSeries;
