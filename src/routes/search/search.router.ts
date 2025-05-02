import { Router } from "express";
import { searchGlobal } from "../../controllers/search.controller";

const routerSearch = Router();

routerSearch.get('', searchGlobal);

export default routerSearch;