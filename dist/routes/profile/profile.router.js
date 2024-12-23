"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const profiles_controller_1 = require("../../controllers/profiles.controller");
const routerProfile = (0, express_1.Router)();
routerProfile.post('/add', profiles_controller_1.addNewProfile);
routerProfile.get('/get/:idUser', profiles_controller_1.getAllProfiles);
routerProfile.get('/get/:idUser/:idProfile', profiles_controller_1.getProfile);
exports.default = routerProfile;
