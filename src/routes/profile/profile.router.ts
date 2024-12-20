import { Router } from "express";
import { addNewProfile, getAllProfiles } from "../../controllers/profiles.controller";
import { getInfoProfile } from "../../controllers/users.controller";
const routerProfile = Router();
routerProfile.post('/add', addNewProfile);
routerProfile.get('/get/:idUser', getAllProfiles);
routerProfile.get('/get/:idUser/:idProfile', getInfoProfile);
export default routerProfile;