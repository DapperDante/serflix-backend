"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const search_controller_1 = require("../../controllers/search.controller");
const routerSearch = (0, express_1.Router)();
routerSearch.get('/movies', search_controller_1.searchMovies);
// routerSearch.get('/series'. searchSeries);
exports.default = routerSearch;
