import { Router } from "express";
import { addFavoriteSerie, deleteFavoriteSerie, getAllSeriesOfProfile, getSerieByIdOfProfile} from "../../controllers/profile_series.controller";
const routerSerie = Router();
routerSerie.post('/add', addFavoriteSerie);
routerSerie.get('/get/:idProfile', getAllSeriesOfProfile);
routerSerie.get('/get/:idProfile/:idSerie', getSerieByIdOfProfile);
routerSerie.delete('/delete/:id', deleteFavoriteSerie)
export default routerSerie;