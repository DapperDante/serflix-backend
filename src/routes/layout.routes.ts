import { Router } from "express";
import { posters } from "../controllers/layout.controller";
const routerLayout = Router();

routerLayout.get("/posters", posters);

export default routerLayout;