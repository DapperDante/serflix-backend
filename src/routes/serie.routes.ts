import { Router } from "express";
import {
	addFavoriteSerie,
	deleteFavoriteSerie,
	getSeriesByProfile,
	getSerieByProfile,
} from "./../controllers/serie.controller";
import { applyRole } from "../middleware/role.middleware";
import { role } from "../interface/token.interface";

const routerSerie = Router();

routerSerie.post("/", applyRole(role.profile), addFavoriteSerie);
routerSerie.get("/", applyRole(role.profile), getSeriesByProfile);
routerSerie.get("/:id", applyRole(role.profile), getSerieByProfile);
routerSerie.delete("/:id", applyRole(role.profile), deleteFavoriteSerie);

export default routerSerie;
