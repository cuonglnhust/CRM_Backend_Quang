import { Router } from 'express';
import { AuthController } from '../controllers';
import { Response } from '../libs/handle_response';
import { isAuth } from '../middlewares/auth';

let routerApp = new Router();
routerApp.post('/login', Response(AuthController.login));
routerApp.post('/loginswitch',isAuth, Response(AuthController.loginswitch));
routerApp.post('/forgotPassword', Response(AuthController.forgotPassword));
routerApp.post('/confirmForgotPassword', Response(AuthController.verifyForgot));

export default routerApp;