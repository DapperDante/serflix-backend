import { Router } from "express";
import { getAllSeriesOfProfile } from "../../controllers/profile_series.controller";
const routerSerie = Router();
// routerSerie.post('/add-favorite', create);
routerSerie.get('/get-all-favorite/:idProfile', getAllSeriesOfProfile);
/* routerSerie.get('/get-all-favorite/user', getByUidAndIdProfile)
routerSerie.get('/get-favorite/:id', getById);
routerSerie.delete('/delete-favorite/:id', deleteById);
routerSerie.put('/update-favorite/:id', update);
 */
export default routerSerie;