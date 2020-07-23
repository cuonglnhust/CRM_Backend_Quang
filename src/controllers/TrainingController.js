import { MidTraining, MidDocumentTraining} from '../models/middle';
import { uploadMedia,uploadMultiMedia } from '../libs/upload';

class TrainingController {

    async getAllVideo(req, res){
        let dataQuery = req.query;

        let listVideoTrain = MidTraining.getAllVideo(dataQuery);

        return listVideoTrain;
    }

    async createVideo(req, res){
        let data = req.body;
        return MidTraining.createVideo(data);
    }

    async getVideoById(req, res){
        let {id} = req.query;

        return MidTraining.getVideoById(id);
    }

    async updateVideo(req, res){
        let dataUpdate = req.body;

        return MidTraining.updateVideo(dataUpdate);
    }

    async deleteVideo(req, res){
        let {id} = req.query;

        return MidTraining.deleteVideo(id);
    }
    
    async UploadFile(req, res){
        const dataUpload = await uploadMultiMedia(req, res);
        let dataPost = req.body
        let title = dataPost.title
        let NameFile = req.protocol + '://' + req.get('host') +'/' + dataUpload[0].filename
        let NameImage = req.protocol + '://' + req.get('host') +'/' + dataUpload[1].filename
        return MidDocumentTraining.UpdateDataUpload(title,NameFile,NameImage)
    }
    async getListDocument(req, res){
        let dataQuery = req.query;
        return MidDocumentTraining.getAllDocument(dataQuery);
    }

    async updateDocument(req, res){
        const dataUpload = await uploadMultiMedia(req, res);   
        let dataUpdate = req.body; 

        let NameFile = "";

        if(dataUpdate.isFile){
            NameFile = req.protocol + '://' + req.get('host') +'/' + dataUpload[0].filename;
        }
        
        let NameImage = "";

        if(!dataUpdate.isFile && dataUpdate.isImage){
            NameImage = req.protocol + '://' + req.get('host') +'/' + dataUpload[0].filename;
        }else if(dataUpdate.isImage){
            NameImage = req.protocol + '://' + req.get('host') +'/' + dataUpload[1].filename;
        }
        
        return MidDocumentTraining.updateDocument(dataUpdate,NameFile,NameImage);
    }

    async DeleteDocument(req, res){
        let {id} = req.query;

        return MidDocumentTraining.deleteDocument(id);
    }

    async getDocumentById(req, res){
        let {id} = req.query;

        return MidDocumentTraining.getDocumentById(id);
    }

}
export default new TrainingController();