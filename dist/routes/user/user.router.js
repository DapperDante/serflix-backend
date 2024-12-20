"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_controller_1 = require("../../controllers/users.controller");
const routerUser = (0, express_1.Router)();
routerUser.post('/add', users_controller_1.addNewUser);
routerUser.post('/verify', users_controller_1.verifyUser);
exports.default = routerUser;
