"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize = new sequelize_1.Sequelize('serflix', 'root', 'Dppdnt26', {
    host: '127.0.0.1',
    dialect: 'mysql',
    port: 3307
});
exports.default = sequelize;
