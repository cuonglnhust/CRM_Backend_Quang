import { Router } from 'express';
import { ProductPackageController } from '../controllers';
import { Response } from '../libs/handle_response';
import { isAuth } from '../middlewares/auth';

let routerApp = new Router();
routerApp.get('/getallpackage', isAuth, Response(ProductPackageController.GetAllPackage));
routerApp.get('/getallpackageexchange', isAuth, Response(ProductPackageController.GetAllPackageExchange));

routerApp.post('/import', isAuth, Response(ProductPackageController.importKey));

export default routerApp;