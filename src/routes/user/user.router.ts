import { Router } from "express";
import { addNewUser, verifyUser } from "../../controllers/users.controller";
const routerUser = Router();
routerUser.post('/add-user', addNewUser);
routerUser.post('/verify-user', verifyUser);
export default routerUser;