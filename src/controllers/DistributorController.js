import { MidDistributor, MidDistributorLinkPayment, MidOrder, MidKey, MidStatistic, MidExchangeKey } from '../models/middle';
import { uploadMedia } from '../libs/upload';
import { SendMail } from '../libs/sendmail';

class DistributorController {
    async searchDistributor(req, res) {
        const { userData } = req;
        let dataQuery = req.query;
        if (userData.type !== 1) {
            dataQuery.parent_id = userData.distributor_id;
        }
        return MidDistributor.getDistributors(dataQuery);
    }

    async getChildDistributor(req, res) {
        const { userData } = req;
        let dataQuery = req.query;
        if (userData.distributor_id) {
            dataQuery.parent_id = userData.distributor_id;
        } else {
            dataQuery.parent_id = 0;
        }
        
        return MidDistributor.getAllDistributors(dataQuery);
    }

    getDetailDistributor(req, res) {
        return MidDistributor.getDistributorById(req.params.id);
    }

    async checkPayment(req, res) {
        const { code } = req.params;
        return MidDistributorLinkPayment.getLinkByCode(code)
    }

    async checkOrder(req, res) {
        const { code } = req.params;
        return MidOrder.getOrderPaymentInfo(code)
    }

    async listDistributor(req, res) {
        const { userData } = req;
        let dataQuery = req.query;
        if (userData.type !== 1) {
            dataQuery.parent_id = userData.id;
        }
        return MidDistributor.getListDistributor(dataQuery);
    }

    async addDistributor(req, res) {

        const { userData } = req;

        let dataPost = req.body;
        if (userData.type !== 1) {
            dataPost.parent_id = userData.distributor_id;
        } else {
            dataPost.parent_id = 0;
        }
        return await MidDistributor.addNewUserManageDistributor(dataPost);
    }

    async activeDistributor(req, res) {
        return MidDistributor.activeDistributor(req.body);
    }

    async getAllInfoPayment(req, res) {
        const { userData } = req;
        const [ accountBank, infoGem ] = await Promise.all([
            MidDistributor.getInfoPayment(userData.distributor_id),
            MidDistributor.getInfoGem(userData.distributor_id)
        ]);

        return {
            accountBank,
            infoGem
        };
    }

    getInfoBank(req, res) {
        const { userData } = req;
        return MidDistributor.getInfoPayment(userData.distributor_id)
    }

    updateAccountBank(req, res) {
        const { userData } = req;
        const dataBank = req.body;

        return MidDistributor.updateInfoPayment(userData.distributor_id, dataBank);
    }

    removeAccountBank(req, res) {
        const { userData } = req;
        const { id } = req.params;

        return MidDistributor.removeInfoPayment(userData.distributor_id, id);
    }

    addAccountBank(req, res) {
        const { userData } = req;
        let dataBank = req.body;
        dataBank.distributor_id = userData.distributor_id;

        return MidDistributor.createInfoPayment(dataBank);
    }

    updateInfoGem(req, res) {
        const { userData } = req;
        const dataGem = req.body;

        return MidDistributor.updateInfoGem(userData.distributor_id, dataGem);
    }

    getLinkPayment(req, res) {
        const { userData } = req;
        if (!userData.distributor_id) {
            return []
        }
        return MidDistributorLinkPayment.getLinkPayment(userData.distributor_id);
    }

    getKeyStore(req, res) {
        const { userData } = req;
        if (!userData.distributor_id) {
            return []
        }

        return MidKey.getKeyStoreDistributor(userData.distributor_id);
    }

    getDataChart(req, res) {
        const { userData } = req;
        let dataQuery = req.query;
        let distributor_id = dataQuery.distributor_id
        if(distributor_id){       
            return MidStatistic.getDataOrderDistributor(parseInt(distributor_id), req.query);
        }
        else{

             const distributor_id = userData.distributor_id || 0;
             return MidStatistic.getDataOrderDistributor(distributor_id, req.query);
        }
        
        
    }

    getDataOrderChart(req, res) {
        const { userData } = req;
        let dataQuery = req.query;
        let distributor_id = dataQuery.distributor_id
        if(!distributor_id){
            distributor_id = userData.distributor_id || 0;
        }

        return MidStatistic.getDataOrderChart(distributor_id, req.query);
    }

    getDataOrderChartDashboard(req, res) {
        const { userData } = req;
        let dataQuery = req.query;
        let distributor_id = dataQuery.distributor_id
        if(distributor_id){
            return MidStatistic.getDataOrderChartDashboard(distributor_id, req.query);
        } else {
             return MidStatistic.getDataOrderChartDashboard(userData.distributor_id || 0, req.query);
        }
    }

    getTopDistributor(req, res) {
        return MidStatistic.getTopDistributor();
    }

    async getGem(req, res) {
        const { userData } = req;
        const distributor_id = userData.distributor_id || 0;
        const dataGem = await MidDistributor.getInfoGem(distributor_id);
        return dataGem ? dataGem.gem_qr : '';
    }

    async uploadGem(req, res) {
        const { userData } = req;
        const distributor_id = userData.distributor_id || 0;
        const dataUpload = await uploadMedia(req, res);
        const gem_qr = req.protocol + '://' + req.get('host') +'/'+ dataUpload.filename;
        await MidDistributor.updateInfoGem(distributor_id, { gem_qr });
        return gem_qr;
    }

    async getKeyAvailable(req, res){
        const { userData } = req;
        const distributor_id = userData.distributor_id || 0;
        
        return MidDistributor.getKeyDistributorAvail(distributor_id);
    }

    async getRequestExchange(req, res) {
        const { userData } = req;
        const dataQuery = req.query;
        const distributor_id = userData.distributor_id || 0;

        return MidExchangeKey.getRequestExchange(distributor_id, dataQuery);
    }
    
    async getConditionToUplevel(req, res){
        const { userData } = req;
        const distributor_id = userData.distributor_id || 0;
        return MidDistributor.getConditionToUplevel(distributor_id);
    
    }
    async getTotalPoints(req, res){
        const { userData } = req;
        const distributor_id = userData.distributor_id || 0;
        return MidDistributor.getTotalPoints(distributor_id);
    }

    async TestSendEmail(req, res){
        let data = [12,145,1345]
        let email = 'cuong.ln158053@sis.hust.edu.vn'
        const test =  await SendMail(data,email);
        return test;
    }

    async getDistributorByEmail(req, res){
        let {email} = req.query;

        return MidDistributor.getDistributorByEmail(email);
    }
}

export default new DistributorController();