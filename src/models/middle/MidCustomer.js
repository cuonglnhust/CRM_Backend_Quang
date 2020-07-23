import { Customer, CustomerRequest, Order } from '../core';
import { Op } from 'sequelize';

class MidCustomer {
    async getCustomerRequest(distributor_id, dataSearch = {}) {
        let condition = {
            distributor_id
        };

        let { page, limit } = dataSearch;
        page = page ? parseInt(page) : 1;
        limit = limit ? parseInt(limit) : 25;

        if (dataSearch.start && dataSearch.end) {
            condition.createdAt = {
                [Op.between]: [new Date(dataSearch.start), new Date(dataSearch.end)]
            }
        }

        const [ listCustomer, total ] = await Promise.all([
            CustomerRequest.findAll({
                where: condition,
                order: [["id", "DESC"]],
                limit,
                offset: (page - 1) * limit
            }),
            CustomerRequest.count({
                where: condition
            })
        ]);

        return {
            rows: listCustomer,
            total: total || 0
        }
    }

    getCustomerByCondition(cond) {
        return Customer.findOne({
            where: cond
        })
    }

    async getCustomerIdByEmail(dataCustomer) {
        const emailExist = await  this.getCustomerByCondition({
            email: dataCustomer.email
        })

        if (emailExist) {
            return emailExist.id;
        }

        const newCustomer = await Customer.create(dataCustomer);
        return newCustomer.id;
    }

    async getCustomerOfDistributor(distributor_id, dataSearch = {}) {
        let condition = {
            distributor_id,
            type: 0
        }

        let conditionCustomer = {};
        if (dataSearch.email) {
            conditionCustomer.email = {
                [Op.like] : `%${dataSearch.email}%`
            }
        }

        if (dataSearch.name) {
            conditionCustomer.name = {
                [Op.like] : `%${dataSearch.name}%`
            }
        }

        let includeOpt = [{
            association: 'customer',
            required: true,
            where: conditionCustomer
        },{
            association: 'productData',
            required: true,
            where: dataSearch.package_id ? { package_id: dataSearch.package_id } : {}
        }]

        let allOrder = await Order.findAll({
            where: condition,
            order: [["id", "DESC"]],
            include: includeOpt
        })

        if (!allOrder.length) {
            return [];
        }

        let dataCustomer = {};
        allOrder.forEach(it => {
            if (!dataCustomer[it.userid]) {
                dataCustomer[it.userid] = {
                    customer: it.customer,
                    order: [it],
                    package: it.productData
                }
            } else {
                let existCustomer = dataCustomer[it.userid];
                existCustomer.order.push(it);
                existCustomer.package = existCustomer.package.concat(it.productData)
            }
        })

        return Object.keys(dataCustomer).map(it => dataCustomer[it]);
    }
}

export default new MidCustomer();