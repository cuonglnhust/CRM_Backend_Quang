import { Router } from 'express';
import { isAuth } from '../middlewares/auth';
import { UserController } from '../controllers';
import { Response } from '../libs/handle_response';

let routerApp = new Router();
routerApp.get('/userInfo', isAuth, Response(UserController.getUserInfo));
routerApp.post('/update', isAuth, Response(UserController.updateProfile));
routerApp.post('/changePassword', isAuth, Response(UserController.changePassword));
routerApp.get('/getPermission', isAuth, Response(UserController.getPermission));

export default routerApp;