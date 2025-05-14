import { Router } from "express";
import {
	loginProfile,
	addPasswordProfile,
	addProfile,
	deletePasswordProfile,
	getProfile,
	getProfiles,
	udpatePasswordProfile,
	updateProfile,
	logoutProfile,
} from "./../controllers/profiles.controller";
import { applyRole } from "../middleware/role.middleware";
import { role } from "../interface/token.interface";

const routerProfile = Router();

routerProfile.post("/", applyRole(role.user), addProfile);
routerProfile.get("/", applyRole(role.profile), getProfile);
routerProfile.put("/", applyRole(role.profile), updateProfile);
routerProfile.post("/login", applyRole(role.user), loginProfile);
routerProfile.post("/logout", applyRole(role.profile), logoutProfile);
routerProfile.post("/password", applyRole(role.profile), addPasswordProfile);
routerProfile.put("/password", applyRole(role.profile), udpatePasswordProfile);
routerProfile.delete("/password", applyRole(role.profile), deletePasswordProfile);
routerProfile.get("/all", applyRole(role.user), getProfiles);

export default routerProfile;
