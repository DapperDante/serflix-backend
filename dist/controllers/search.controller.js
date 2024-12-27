"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchMovies = void 0;
const search_IA_1 = require("../IA/search.IA");
const searchMovies = async (req, resp) => {
    try {
        const { query } = req;
        if (!query.query || !query.times || !query.manyItemsRelation)
            throw new Error();
        const movies = await getMoviesByTitle(query.query.toString());
        //First it search movie and if it doesn't have any relation with that title, 
        //so research at least one movie with that text throught similarities
        if (!movies.results.length) {
            //This parameters to calibrate how many values returned or  values research
            const result = await (0, search_IA_1.getDataToSearch)(query.query, Number(query.times), Number(query.manyItemsRelation));
            resp.status(200).json({ results: result, total_pages: 1, total_results: result.length });
            return;
        }
        resp.status(200).json(movies);
    }
    catch (err) {
        resp.status(400).json({
            msg: "query incorrect"
        });
    }
};
exports.searchMovies = searchMovies;
const getMoviesByTitle = async (title) => {
    let data;
    await fetch(`${process.env.API_TMDB}/search/movie?query=${title}&include_adult=false&language=en-US&page=1`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${process.env.TOKEN_TMDB}`,
        },
    }).then(async (movies) => {
        data = await movies.json();
    });
    data.results = data.results.filter(movie => movie.poster_path);
    return data;
};
