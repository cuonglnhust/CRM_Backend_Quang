import { Router } from 'express';
import { OrderController } from '../controllers';
import { Response } from '../libs/handle_response';
import { isAuth } from '../middlewares/auth';

let routerApp = new Router();
routerApp.get('/search', isAuth, Response(OrderController.searchOrder));
routerApp.get('/searchOrderBuy', isAuth, Response(OrderController.getOrderDistributorBuy));
routerApp.post('/createRetail', isAuth, Response(OrderController.createOrderRetail));
routerApp.post('/createWholeSale', isAuth, Response(OrderController.createOrderWholeSale));
routerApp.post('/confirmPayment', isAuth, Response(OrderController.confirmPayment));
routerApp.post('/cancelOrder', isAuth, Response(OrderController.cancelOrder));
routerApp.post('/createOrderWholeSale', isAuth, Response(OrderController.createWholeSale));
routerApp.get('/getOrderWholeSale', isAuth, Response(OrderController.getOrderDistributorBuy));

routerApp.post('/guest/requestOrder', Response(OrderController.createOrderGuest));
routerApp.get('/getOrderKey/:code', Response(OrderController.getOrderKey));
routerApp.post('/getExtraInfoOrder/:id', Response(OrderController.getExtraInfoOrder));

routerApp.post('/createExchange', isAuth, Response(OrderController.createExchangeKey));
routerApp.get('/getAllExchange', isAuth, Response(OrderController.getAllExchangeKey));
routerApp.get('/confirmExchange', isAuth, Response(OrderController.confirmExchangeKey));
routerApp.get('/cancelExchange', isAuth, Response(OrderController.cancelExchangeKey));
routerApp.get('/cancelExchangeDistributor', isAuth, Response(OrderController.cancelExchangeKeyDistributor));

export default routerApp;