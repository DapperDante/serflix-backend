"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const profile_series_controller_1 = require("../../controllers/profile_series.controller");
const routerSerie = (0, express_1.Router)();
// routerSerie.post('/add-favorite', create);
routerSerie.get('/get-all-favorite/:idProfile', profile_series_controller_1.getAllSeriesOfProfile);
/* routerSerie.get('/get-all-favorite/user', getByUidAndIdProfile)
routerSerie.get('/get-favorite/:id', getById);
routerSerie.delete('/delete-favorite/:id', deleteById);
routerSerie.put('/update-favorite/:id', update);
 */
exports.default = routerSerie;
