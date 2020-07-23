import { Router } from 'express';
import { PermissionController } from '../controllers';
import { Response } from '../libs/handle_response';
import { isAuth } from '../middlewares/auth';

let routerApp = new Router();


export default routerApp;