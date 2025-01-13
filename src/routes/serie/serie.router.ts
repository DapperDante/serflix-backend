import { Router } from "express";
import { addFavoriteSerie, deleteFavoriteSerie, getSeriesByProfile, getSerieByProfile} from "../../controllers/profile_series.controller";
const routerSerie = Router();
routerSerie.post('/add', addFavoriteSerie);
routerSerie.get('/get', getSeriesByProfile);
routerSerie.get('/get/:idSerie', getSerieByProfile);
routerSerie.delete('/delete/:id', deleteFavoriteSerie);
export default routerSerie;