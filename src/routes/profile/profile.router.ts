import { Router } from "express";
import { addPasswordProfile, addProfile, deletePasswordProfile, getProfile, getProfiles, logInProfile, udpatePasswordProfile, updateProfile} from "../../controllers/profiles.controller";

const routerProfile = Router();

routerProfile.post('/add', addProfile);
routerProfile.get('/get-all', getProfiles);
routerProfile.post('/log-in', logInProfile);
routerProfile.get('/get', getProfile);
routerProfile.put('/put', updateProfile);
routerProfile.post('/add-password', addPasswordProfile);
routerProfile.put('/update-password', udpatePasswordProfile);
routerProfile.delete('/delete-password', deletePasswordProfile);

export default routerProfile;