import { Router } from 'express';
import { TrainingController } from '../controllers';
import { Response } from '../libs/handle_response';
import { isAuth } from '../middlewares/auth';

let routerApp = new Router();
routerApp.get('/getAllVideo',isAuth, Response(TrainingController.getAllVideo));
routerApp.post('/createVideo',isAuth, Response(TrainingController.createVideo));
routerApp.post('/updateVideo',isAuth, Response(TrainingController.updateVideo));
routerApp.get('/getVideoById',isAuth, Response(TrainingController.getVideoById));
routerApp.get('/deleteVideo',isAuth, Response(TrainingController.deleteVideo));

routerApp.post('/upload',isAuth, Response(TrainingController.UploadFile));
routerApp.get('/getalldocument',isAuth, Response(TrainingController.getListDocument));
routerApp.get('/deletedocument',isAuth, Response(TrainingController.DeleteDocument));
routerApp.post('/updatedocument',isAuth, Response(TrainingController.updateDocument));
routerApp.get('/getDocumentById',isAuth, Response(TrainingController.getDocumentById));

export default routerApp;