import { Router } from "express";
import { register, login, changePassword, changeUsername } from "../../controllers/users.controller";
const routerUser = Router();
routerUser.post('/register', register);
routerUser.post('/login', login);
routerUser.post('/change-password', changePassword);
routerUser.post('/change-username', changeUsername);
export default routerUser;