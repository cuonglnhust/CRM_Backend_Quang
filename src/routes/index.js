import { Router } from 'express';
import auth from './auth';


let routerApp = new Router();

routerApp.use('/auth', auth);


export default routerApp;