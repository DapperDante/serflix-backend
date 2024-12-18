"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../db/connection"));
const Users = connection_1.default.define('users', {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    username: {
        type: sequelize_1.DataTypes.TEXT,
        unique: true,
        allowNull: false
    },
    email: {
        type: sequelize_1.DataTypes.TEXT,
        unique: true,
        allowNull: false
    },
    password: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false
    }
}, {
    createdAt: false,
    updatedAt: false
});
exports.default = Users;
