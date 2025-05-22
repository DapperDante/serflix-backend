import { Router } from "express";
import { searchGlobal } from "./../controllers/search.controller";
import { applyRole } from "../middleware/role.middleware";
import { role } from "../interface/token.interface";

const routerSearch = Router();

routerSearch.get('/', applyRole(role.profile),searchGlobal);

export default routerSearch;