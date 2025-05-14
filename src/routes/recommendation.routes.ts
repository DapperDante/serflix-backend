import { Router } from "express";
import {
	getRecommendations,
	getRecommendationsByProfile,
} from "./../controllers/recommendations.controller";
import { applyRole } from "../middleware/role.middleware";
import { role } from "../interface/token.interface";

const routerRecommendation = Router();

routerRecommendation.get("/all", applyRole(role.profile), getRecommendations);
routerRecommendation.get("/", applyRole(role.profile), getRecommendationsByProfile);

export default routerRecommendation;
