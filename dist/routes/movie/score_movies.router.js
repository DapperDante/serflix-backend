"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const score_movies_controller_1 = require("../../controllers/score_movies.controller");
const routerReview = (0, express_1.Router)();
routerReview.post('/add-review', score_movies_controller_1.addNewReview);
routerReview.get('/get-review/:idMovie', score_movies_controller_1.getReviewOfMovie);
exports.default = routerReview;
