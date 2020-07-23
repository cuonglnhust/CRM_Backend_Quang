import { MidDistributor, MidUser, MidOrder, MidExchangeKey } from '../models/middle';

class OrderController {
    /**
     * Lay danh sach don hang le
     *   type = 0
     * Lay danh sach don hang si
     *   type = 1
     * @param {*} req 
     * @param {*} res 
     */
    async searchOrder(req, res) {
        const { userData } = req;
        let dataQuery = req.query;
        if(dataQuery.distributor_id){
            dataQuery.distributor_id = dataQuery.distributor_id;
        } else if (userData.type !== 1) {
            dataQuery.distributor_id = userData.distributor_id;
        }

        return MidOrder.searchOrders(dataQuery);
    }

    // Lay danh sach mua si cua dai ly
    async getOrderDistributorBuy(req, res) {
        const { userData } = req;
        let dataQuery = req.query;
        const { distributor_id } = userData;

        return MidOrder.getOrderBuyOfDistributor(distributor_id, dataQuery);
    }
    
    // Tao don hang ban le
    createOrderRetail(req, res) {
        let dataOrder = req.body;
        const { userData } = req;
        const { distributor_id } = userData;
        return MidOrder.createNewOrderRetail(distributor_id, dataOrder);
    }

    // Tao don hang ban si
    async createOrderWholeSale(req, res) {
        let dataOrder = req.body;
        const { userData } = req;

        if (!dataOrder.distributor_buy_id) {
            throw new Error('Đại lý không tồn tại');
        }

        const distributorBuy = await MidDistributor.getDistributorById(dataOrder.distributor_buy_id);
        if (!distributorBuy) {
            throw new Error('Đại lý không tồn tại');
        }
        return MidOrder.createOrderWholeSale(userData.distributor_id || 0, distributorBuy.level, dataOrder);
    }

    async createWholeSale(req, res) {
        let dataOrder = req.body;
        const { userData } = req;
        if (!userData.distributor_id) {
            throw new Error('Tài khoản không tạo được đơn hàng mua sỉ')
        }

        const distributorData = await MidDistributor.getDistributorById(userData.distributor_id);
        if (!distributorData) {
            throw new Error('Tài khoản không tạo được đơn hàng mua sỉ')
        }

        const parent_id = distributorData.parent_id || 0;
        return MidOrder.createWholeSale(parent_id, userData.distributor_id, distributorData.level, dataOrder);
    }

    confirmPayment(req, res) {
        let dataOrder = req.body;
        const { userData } = req;
        const { distributor_id } = userData;
        return MidOrder.confirmPayment(distributor_id, dataOrder);
    }

    cancelOrder(req, res) {
        let dataOrder = req.body;
        const { userData } = req;
        const { distributor_id } = userData;
        return MidOrder.cancelOrder(distributor_id, dataOrder);
    }

    createOrderGuest(req, res) {
        let dataOrder = req.body;
        return MidOrder.createOrderGuest(dataOrder);
    }

    getOrderKey(req, res) {
        const { code } = req.params;
        return MidOrder.getOrderKey(code);
    }

    getExtraInfoOrder(req, res) {
        const { id } = req.params;
        return MidOrder.getExtraInfoOrder(id);
    }

    createExchangeKey(req, res){
        let {userData} = req;
        let distributor_id = userData.distributor_id;
        const dataExchange = req.body;

        return MidExchangeKey.createExchangeKey(dataExchange, distributor_id);
    }

    getAllExchangeKey(req, res){
        let {userData} = req;
        let distributor_id = userData.distributor_id;
        let dataQuery = req.query;

        return MidExchangeKey.getAllExchangeKeyDistributor(dataQuery, distributor_id || 0);
    }

    confirmExchangeKey(req, res){
        let {userData} = req;
        let user_id = userData.distributor_id;
        let {id} = req.query;

        return MidExchangeKey.confirmExchange(id, user_id);
    }

    cancelExchangeKey(req, res){
        let {userData} = req;
        let distributor_id = userData.distributor_id;
        let { id } = req.query;
        return MidExchangeKey.cancelExchange(id, distributor_id || 0);
    }

    cancelExchangeKeyDistributor(req, res){
        let {userData} = req;
        let distributor_id = userData.distributor_id;
        let { id } = req.query;
        return MidExchangeKey.cancelExchangeDistributor(id, distributor_id || 0);
    }
}

export default new OrderController();