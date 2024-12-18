"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const movie_1 = require("../controllers/movie");
const router = (0, express_1.Router)();
router.get('/', movie_1.getMovie);
exports.default = router;
