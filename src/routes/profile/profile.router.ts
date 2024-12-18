import { Router } from "express";
import { addNewProfile, getAllProfiles } from "../../controllers/profiles.controller";
import { getInfoProfile } from "../../controllers/users.controller";
const routerProfile = Router();
routerProfile.post('/add-profile', addNewProfile);
routerProfile.get('/get-all-profiles/:id', getAllProfiles);
routerProfile.get('/get-info-profile/:idUser/:idProfile', getInfoProfile);
export default routerProfile;