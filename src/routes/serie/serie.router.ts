import { Router } from "express";
import { addFavoriteSerie, deleteFavoriteSerie, getAllFavoriteSeriesByProfile, getOnlyFavoriteSerie} from "../../controllers/profile_series.controller";
const routerSerie = Router();
routerSerie.post('/add', addFavoriteSerie);
routerSerie.get('/get/:idProfile', getAllFavoriteSeriesByProfile);
routerSerie.get('/get/:idProfile/:idSerie', getOnlyFavoriteSerie);
routerSerie.delete('/delete/:id', deleteFavoriteSerie)
export default routerSerie;