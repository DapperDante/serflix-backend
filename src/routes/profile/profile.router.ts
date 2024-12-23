import { Router } from "express";
import { addNewProfile, getAllProfiles, getProfile } from "../../controllers/profiles.controller";
const routerProfile = Router();
routerProfile.post('/add', addNewProfile);
routerProfile.get('/get/:idUser', getAllProfiles);
routerProfile.get('/get/:idUser/:idProfile', getProfile);
export default routerProfile;