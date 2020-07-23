import { Router } from 'express';
import { ProductKeyController } from '../controllers';
import { Response } from '../libs/handle_response';
import { isAuth } from '../middlewares/auth';

let routerApp = new Router();
routerApp.get('/getallproductKey',isAuth, Response(ProductKeyController.searchKey));
routerApp.get('/getstatisticalkey',isAuth, Response(ProductKeyController.getstatisticalKey));


export default routerApp;