import { Router } from "express";
import {
	login,
	updatePassword,
	updateUsername,
	updateToFree,
	authenticate,
	requestForgotPassword,
	signup,
	forgotPassword,
	updateToPremium,
} from "../controllers/users.controller";
import { applyRole } from "../middleware/role.middleware";
import { role } from "../interface/token.interface";

const routerUser = Router();

routerUser.post("/signup", signup);
routerUser.post("/login", login);
routerUser.put("/request/forgot-password", requestForgotPassword);
routerUser.put("/forgot-password", applyRole(role.forgot_password), forgotPassword);
routerUser.put("/auth", applyRole(role.auth),authenticate);
// routerUser.put("/first-time", applyRole("user"), updateFirstTime);
routerUser.put("/password", applyRole(role.user, role.profile), updatePassword);
routerUser.put("/username", applyRole(role.user), updateUsername);
routerUser.put("/premium", applyRole(role.user), updateToPremium);
routerUser.put("/free", applyRole(role.user), updateToFree);

export default routerUser;
