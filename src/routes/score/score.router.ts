import { Router } from "express";
import { addReviewMovie, getReviewsMovie } from "../../controllers/score_movies.controller";
import { addReviewSerie, getReviewsSerie } from "../../controllers/score_series.controller";
const routerReview = Router();
routerReview.post('/movie/add', addReviewMovie);
routerReview.get('/movie/get/:idMovie', getReviewsMovie);
routerReview.post('/serie/add', addReviewSerie);
routerReview.get('/serie/get/:idSerie', getReviewsSerie);
export default routerReview;