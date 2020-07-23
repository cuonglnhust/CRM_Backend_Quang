import { Router } from 'express';
import { DistributorController } from '../controllers';
import { Response } from '../libs/handle_response';
import { isAuth } from '../middlewares/auth';

let routerApp = new Router();
routerApp.get('/search', isAuth, Response(DistributorController.searchDistributor));
routerApp.get('/getChildDistributor', isAuth, Response(DistributorController.getChildDistributor));
routerApp.get('/detail/:id', isAuth, Response(DistributorController.getDetailDistributor));
routerApp.get('/all', isAuth, Response(DistributorController.listDistributor));
routerApp.post('/add', isAuth, Response(DistributorController.addDistributor));
routerApp.post('/active', isAuth, Response(DistributorController.activeDistributor));
routerApp.get('/getBank', isAuth, Response(DistributorController.getInfoBank));
routerApp.post('/updateBank', isAuth, Response(DistributorController.updateAccountBank));
routerApp.post('/removeBank/:id', isAuth, Response(DistributorController.removeAccountBank));
routerApp.post('/addBank', isAuth, Response(DistributorController.addAccountBank));
routerApp.get('/linkPayment', isAuth, Response(DistributorController.getLinkPayment));
routerApp.get('/getKey', isAuth, Response(DistributorController.getKeyStore));
routerApp.get('/getKeyAvailable', isAuth, Response(DistributorController.getKeyAvailable));
routerApp.get('/getDistributorByEmail', isAuth, Response(DistributorController.getDistributorByEmail));

routerApp.get('/getGem', isAuth, Response(DistributorController.getGem));
routerApp.post('/uploadGem', isAuth, Response(DistributorController.uploadGem));

routerApp.get('/dataChart', isAuth, Response(DistributorController.getDataChart));
routerApp.get('/dataOrderChart', isAuth, Response(DistributorController.getDataOrderChart));
routerApp.get('/orderChartDashboard', isAuth, Response(DistributorController.getDataOrderChartDashboard));

routerApp.get('/top', Response(DistributorController.getTopDistributor));

routerApp.get('/requestExchange', isAuth, Response(DistributorController.getRequestExchange));
routerApp.get('/getconditionuplevel',isAuth, Response(DistributorController.getConditionToUplevel));
routerApp.get('/getTotalPoints',isAuth, Response(DistributorController.getTotalPoints));
routerApp.get('/send',isAuth, Response(DistributorController.TestSendEmail));

export default routerApp;