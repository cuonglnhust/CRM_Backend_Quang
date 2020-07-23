import { MidKey } from '../models/middle';
import { checkToken } from '../libs/token';
import { MidUser } from '../models/middle';

class ProductKeyController {
    async searchKey(req, res) {
        const { userData } = req;
        let dataQuery = req.query;
        if (userData.type !== 1) {
            dataQuery.distributor_id = userData.distributor_id;
            return MidKey.searchKeyDistributor(dataQuery);
        } else {
            return MidKey.searchKey(dataQuery);
        }
    }
    async getstatisticalKey(req, res) {
        let { userData } = req;
        let dataQuery = req.query;
        if (dataQuery.distributor_id) {
            return MidKey.getStatisticalDistributorKey(dataQuery.distributor_id); 
        } else {
            if(!userData.distributor_id){
                return MidKey.getStatisticalKey(); 
            } else {
                return MidKey.getStatisticalDistributorKey(userData.distributor_id);
            }
        }
    }
   
}
export default new ProductKeyController();