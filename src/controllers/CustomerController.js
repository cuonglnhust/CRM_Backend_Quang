import { MidCustomer } from '../models/middle';

class CustomerController {
    getRequest(req, res) {
        const { userData } = req;
        const dataQuery = req.query;
        const { distributor_id } = userData;
        if (!distributor_id) return [];
        return MidCustomer.getCustomerRequest(distributor_id, dataQuery);
    }

    getListCustomer(req, res) {
        const { userData } = req;
        const dataQuery = req.query;
        const { distributor_id } = userData;
        if (!distributor_id) return [];
        return MidCustomer.getCustomerOfDistributor(distributor_id, dataQuery);
    }
}

export default new CustomerController();