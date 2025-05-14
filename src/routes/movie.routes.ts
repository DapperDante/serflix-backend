import { Router } from "express";
import {
	addFavoriteMovie,
	deleteFavoriteMovie,
	getMovieByProfile,
	getMoviesByProfile,
} from "../controllers/movie.controller";
import { applyRole } from "../middleware/role.middleware";
import { role } from "../interface/token.interface";

const routerMovie = Router();

routerMovie.post("/", applyRole(role.profile), addFavoriteMovie);
routerMovie.get("/", applyRole(role.profile), getMoviesByProfile);
routerMovie.get("/:id", applyRole(role.profile), getMovieByProfile);
routerMovie.delete("/:id", applyRole(role.profile), deleteFavoriteMovie);

export default routerMovie;
