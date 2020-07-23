import { Router } from 'express';
import { NotificationController, CustomerController } from '../controllers';
import { Response } from '../libs/handle_response';
import { isAuth } from '../middlewares/auth';

let routerApp = new Router();
routerApp.post('/createnotification', Response(NotificationController.CreateNotification));
routerApp.get('/getnotificationforDistributor', isAuth, Response(NotificationController.GetNotificationforDistributor));
routerApp.get('/getallnotification', Response(NotificationController.GetallNotify));
routerApp.get('/getnotificationbyid', Response(NotificationController.GetNotifyByid));
routerApp.post('/updatenotification', Response(NotificationController.updateNotify));
routerApp.get('/deletenotification', Response(NotificationController.DeleteNotify));

routerApp.get('/createdistrinotify', isAuth, Response(NotificationController.CreateDistriNotify));
routerApp.get('/GetAllNotifyDistri', isAuth, Response(NotificationController.GetAllNotifyDistri));

routerApp.get('/GetAllNotifyDetailDistri', isAuth, Response(NotificationController.GetNotifyDetailDis));
routerApp.get('/SearchAllNotifyDetailDistri', isAuth, Response(NotificationController.SearchNotifyDetailDis));
routerApp.post('/UpdateReadNotifyDetailDistri', isAuth, Response(NotificationController.CheckReadNotifyDetailDis));


export default routerApp;