import { Router } from "express";
import { searchMovies } from "../../controllers/search.controller";
const routerSearch = Router();
routerSearch.get('/movies', searchMovies);
// routerSearch.get('/series'. searchSeries);
export default routerSearch;