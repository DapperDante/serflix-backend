import { Router } from "express";
import { addNewUser, verifyUser } from "../../controllers/users.controller";
const routerUser = Router();
routerUser.post('/add', addNewUser);
routerUser.post('/verify', verifyUser);
export default routerUser;