"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMovie = void 0;
const getMovie = (req, resp) => {
    resp.json({
        title: 'Deadpool',
        psoter: 'demo.jpg'
    });
};
exports.getMovie = getMovie;
