import { Router } from "express";
import { getRecommendations, getRecommendationsByProfile } from "../../controllers/recommendations.controller";
const routerRecommendation = Router();
routerRecommendation.get("/get", getRecommendations);
routerRecommendation.get("/get-profile", getRecommendationsByProfile);
export default routerRecommendation;