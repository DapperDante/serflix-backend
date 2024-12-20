import { Router } from "express";
import { addNewReviewOfMovie, getReviewOfMovie } from "../../controllers/score_movies.controller";
import { addNewReviewOfSerie, getReviewOfSerie } from "../../controllers/score_series.controller";
const routerReview = Router();
routerReview.post('/movie/add', addNewReviewOfMovie);
routerReview.get('/movie/get/:idMovie', getReviewOfMovie);
routerReview.post('/serie/add', addNewReviewOfSerie);
routerReview.get('/serie/get/:idSerie', getReviewOfSerie);
export default routerReview;