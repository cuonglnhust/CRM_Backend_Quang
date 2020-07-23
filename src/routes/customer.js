import { Router } from 'express';
import { DistributorController, CustomerController } from '../controllers';
import { Response } from '../libs/handle_response';
import { isAuth } from '../middlewares/auth';

let routerApp = new Router();
routerApp.get('/getCode/:code', Response(DistributorController.checkPayment));
routerApp.get('/getOrder/:code', Response(DistributorController.checkOrder));

routerApp.get('/allCustomer', isAuth, Response(CustomerController.getListCustomer));

export default routerApp;