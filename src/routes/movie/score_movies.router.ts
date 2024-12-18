import { Router } from "express";
import { addNewReview, getReviewOfMovie } from "../../controllers/score_movies.controller";
const routerReview = Router();
routerReview.post('/add-review', addNewReview);
routerReview.get('/get-review/:idMovie', getReviewOfMovie);
export default routerReview;