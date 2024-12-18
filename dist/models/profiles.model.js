"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../db/connection"));
const users_model_1 = __importDefault(require("./users.model"));
const Profiles = connection_1.default.define('profiles', {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    user_id: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: users_model_1.default,
            key: 'id'
        },
        allowNull: false
    },
    name: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false
    },
    img: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false
    }
}, {
    createdAt: false,
    updatedAt: false
});
exports.default = Profiles;
