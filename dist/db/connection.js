"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize = new sequelize_1.Sequelize('serflix', 'root', 'Dppdnt26', {
    host: 'localhost',
    dialect: 'mysql'
});
exports.default = sequelize;
