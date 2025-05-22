import { Router } from "express";
import {
	addReviewMovie,
	getReviewsMovie,
} from "./../controllers/score_movies.controller";
import {
	addReviewSerie,
	getReviewsSerie,
} from "./../controllers/score_series.controller";
import { applyRole } from "../middleware/role.middleware";
import { role } from "../interface/token.interface";

const routerReview = Router();

routerReview.post("/movie/", applyRole(role.profile), addReviewMovie);
routerReview.get("/movie/:id", applyRole(role.profile), getReviewsMovie);
routerReview.post("/serie/", applyRole(role.profile), addReviewSerie);
routerReview.get("/serie/:id", applyRole(role.profile), getReviewsSerie);

export default routerReview;
