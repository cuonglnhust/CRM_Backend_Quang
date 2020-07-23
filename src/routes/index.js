import { Router } from 'express';
import auth from './auth';
import profile from './profile';
import distributor from './distributor';
import order from './order';
import permission from './permission';
import productpackage from './productpackage';
import productkey from './productkey';
import customer from './customer';
import notification from './notification';
import training from './training';

let routerApp = new Router();
routerApp.use('/profile', profile);
routerApp.use('/auth', auth);
routerApp.use('/distributor', distributor);
routerApp.use('/order', order);
routerApp.use('/permission', permission);
routerApp.use('/productkey', productkey);
routerApp.use('/customer', customer);
routerApp.use('/productpackage', productpackage);
routerApp.use('/notification', notification);
routerApp.use('/training', training);

export default routerApp;