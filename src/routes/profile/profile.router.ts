import { Router } from "express";
import { addProfile, getProfile, getProfiles, logInProfile, updateProfile} from "../../controllers/profiles.controller";
const routerProfile = Router();
routerProfile.post('/add', addProfile);
routerProfile.get('/get-all', getProfiles);
//this is to manage control of log in and out of the profile
routerProfile.post('/log-in', logInProfile);
routerProfile.get('/get', getProfile);
routerProfile.put('/put', updateProfile);
export default routerProfile;