import { Router } from "express";
import { register, login } from "../../controllers/users.controller";
const routerUser = Router();
routerUser.post('/register', register);
routerUser.post('/login', login);
export default routerUser;