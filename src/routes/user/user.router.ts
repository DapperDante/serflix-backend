import { Router } from "express";
import { register, login, updateFirstTime, updatePassword, updateUsername, updateToFree, authenticate, requestResetPassword, resetPassword } from "../../controllers/users.controller";

const routerUser = Router();

routerUser.post('/register', register);
routerUser.post('/login', login);
routerUser.put('/request-reset-password', requestResetPassword);
routerUser.put('/reset-password', resetPassword);
routerUser.put('/update-first-time', updateFirstTime);
routerUser.put('/auth', authenticate);
routerUser.put('/update-password', updatePassword);
routerUser.put('/update-username', updateUsername);
routerUser.put('/update-to-premium', updateUsername);
routerUser.put('/update-to-free', updateToFree);

export default routerUser;