import { Op } from 'sequelize';
import { UserDistributor, Distributor, DistributorInfoPayment, DistributorGem, DistributerKey, Order, NotifyDetail } from '../core';
import { ERROR_MESSAGE } from '../../config/error';
import { hashPassword } from '../../libs/encrypt';
import { generateRandomCode } from '../../libs/random';
import { sequelize } from '../../connections';

class MidDistributor {

    async getAllUserOfDistributor(distributor_id, search) {
        let condition = {
            distributor_id,
            del: 0
        }

        let { page, limit } = search;

        page = page ? parseInt(page) : 1;
        limit = limit ? parseInt(limit) : 25;

        if (search.email) {
            condition.email = {
                [Op.like]: `%${search.email}%`
            }
        }

        if (search.name) {
            condition.name = {
                [Op.like]: `%${search.name}%`
            }
        }

        let listDistri = await UserDistributor.findAndCountAll({
            where: condition,
            includes: ['role'],
            limit,
            offset: (page - 1) * limit
        })

        return { rows: listDistri }
    }

    async getUserManagementSystem(search = {}) {
        let condition = {
            del: 0,
            type: 1
        }

        let { page, limit } = search;

        page = page ? parseInt(page) : 1;
        limit = limit ? parseInt(limit) : 25;

        if (search.email) {
            condition.email = {
                [Op.like]: `%${search.email}%`
            }
        }

        if (search.name) {
            condition.name = {
                [Op.like]: `%${search.name}%`
            }
        }

        return await UserDistributor.findAndCountAll({
            where: condition,
            includes: ['role'],
            limit,
            offset: (page - 1) * limit
        })
    }

    getDistributorById(id) {
        return Distributor.findOne({
            where: { id }
        })
    }
    getDistributorNameById(id) {
        return UserDistributor.findOne({
            where: { distributor_id: id }
        })
    }

    async addNewUserManageDistributor(data) {
        if (!data.email || !data.level || !data.password || !data.name || !data.products) {
            throw new Error(ERROR_MESSAGE.ADD_USER_DISTRIBUTOR.ERR_REQUIRE)
        }
        const existEmail = await MidUser.getUserByEmail(data.email);
        if (existEmail) {
            throw new Error(ERROR_MESSAGE.ADD_USER_DISTRIBUTOR.ERR_EXIST);
        }

        if (data.parent_id) {
            const distributorParent = await this.getDistributorById(data.parent_id);
            if (!distributorParent) {
                throw new Error(ERROR_MESSAGE.ADD_USER_DISTRIBUTOR.ERR_DISTRIBUTOR_PARENT);
            }

            // data.level = distributorParent.level + 1;
        }

        //check con key thi moi duoc tao dai ly
        let p_pk = data.products.map(it => {
            if (data.parent_id) {
                return MidKey.countKeyDistributorWithCondition({
                    is_sell: 0,
                    is_exchange: 0,
                    package_id: it.package_id
                })
            } else {
                return MidKey.countKeyWithCondition({
                    package_id: it.package_id,
                    is_sell: 0
                })
            }
        })

        const dataStoreKey = await Promise.all(p_pk);
        let isValidKey = true;
        data.products.forEach((it, idx) => {
            if (!dataStoreKey[idx] || it.quantity > dataStoreKey[idx]) {
                isValidKey = false;
            }
        })

        if (!isValidKey) {
            throw new Error(ERROR_MESSAGE.ADD_USER_DISTRIBUTOR.INVALID_KEY);
        }

        data.del = 0;
        data.active = 1;
        data.code = generateRandomCode('DL-', 8);
        data.level = parseInt(data.level);
        let newDistributor = await Distributor.create(data);
        const password = await hashPassword(data.password);
        const dataUser = Object.assign(data, { type: 2, status: 1, distributor_id: newDistributor.id, password, level: data.level });
        const roleDefault = await MidPermission.getRoleDefaultDistributor();
        const userIns = await UserDistributor.create(dataUser);

        if (roleDefault) {
            MidPermission.addUserRole({ userid: userIns.id, role_id: roleDefault })
        }

        await MidOrder.createOrderWholeSale(data.parent_id || 0, newDistributor.level, {
            distributor_buy_id: newDistributor.id,
            products: data.products
        });
        // add Notify
        let distributorParent = await MidDistributor.getDistributorById(data.parent_id);
        let distributorCreate = await MidDistributor.getDistributorById(newDistributor.id);
        
        let dataCreateNotify = {
            content: distributorParent.name + ' '+ 'đã tạo đại lý' + ' ' + distributorCreate.name,
            type: 3,
            status: 0
        }
        await NotifyDetail.create(dataCreateNotify)
        return userIns;
    }

    async activeDistributor(data) {
        const { distributor_id } = data;
        if (!distributor_id) {
            throw new Error(ERROR_MESSAGE.ACTIVE_DISTRIBUTOR.ERR_REQUIRE);
        }

        let distributorData = await this.getDistributorById(distributor_id);
        if (!distributorData) {
            throw new Error(ERROR_MESSAGE.ACTIVE_DISTRIBUTOR.ERR_REQUIRE);
        }

        return distributorData.update({ active: 1 });
    }

    async getDistributors(data) {
        let condition = {};
        if (data.parent_id) {
            condition.parent_id = data.parent_id;
        }
        if (data.distributor_id) {
            condition.id = {
                [Op.eq]: parseInt(data.distributor_id)
            }
        }
        if (data.name) {
            condition.name = {
                [Op.like]: `%${data.name}%`
            }
        }

        if (data.email) {
            condition.email = {
                [Op.like]: `%${data.email}%`
            }
        }

        if (data.mobile) {
            condition.mobile = {
                [Op.like]: `%${data.mobile}%`
            }
        }

        if (data.level) {
            condition.level = parseInt(data.level);
        }

        let { page, limit } = data;
        page = page ? parseInt(page) : 1;
        limit = limit ? parseInt(limit) : 25;

        const [alllDistributor, total] = await Promise.all([
            Distributor.findAll({
                where: condition,
                order: [["id", "DESC"]],
                limit,
                offset: (page - 1) * limit
            }),
            Distributor.count({
                where: condition
            })
        ])

        return {
            rows: alllDistributor,
            total: total || 0
        }
    }

    async getAllDistributors(data) {

        let condition = {};
        if (data.parent_id || data.parent_id == 0) {
            condition.parent_id = data.parent_id;
        }
        if (data.distributor_id) {
            condition.id = parseInt(data.distributor_id)
        }
        if (data.name) {
            condition.name = {
                [Op.like]: `%${data.name}%`
            }
        }

        if (data.email) {
            condition.email = {
                [Op.like]: `%${data.email}%`
            }
        }

        if (data.mobile) {
            condition.mobile = {
                [Op.like]: `%${data.mobile}%`
            }
        }

        if (data.level) {
            condition.level = parseInt(data.level);
        }

        let findObj = {
            where: condition,
            order: [["id", "DESC"]]
        };

        if (data.limit) {
            findObj.limit = parseInt(data.limit);
            findObj.offset = parseInt(0);
        }

        return Distributor.findAll(findObj);
    }

    getInfoPayment(distributor_id) {
        return DistributorInfoPayment.findAll({
            where: {
                distributor_id
            }
        })
    }

    getPaymentByCond(cond) {
        return DistributorInfoPayment.findOne({
            where: cond
        })
    }

    createInfoPayment(data) {
        return DistributorInfoPayment.create(data);
    }

    async updateInfoPayment(distributor_id, data) {
        if (!data.id) {
            throw new Error('Require params')
        }

        let existInfo = await this.getPaymentByCond({ distributor_id, id: data.id });
        if (!existInfo) {
            throw new Error('Yêu cầu không hợp lệ')
        }

        return existInfo.update(data);
    }

    async removeInfoPayment(distributor_id, id) {

        let existInfo = await this.getPaymentByCond({ distributor_id, id });
        if (!existInfo) {
            throw new Error('Yêu cầu không hợp lệ')
        }

        return existInfo.destroy();
    }

    async getListDistributor(data) {

        const [alllDistributor, total] = await Promise.all([
            Distributor.findAll({
                order: [["id", "DESC"]]
            })
        ])

        return {
            rows: alllDistributor
        }
    }

    getInfoGem(distributor_id) {
        return DistributorGem.findOne({
            where: {
                distributor_id
            }
        })
    }

    createInfoGem(data) {
        return DistributorGem.create(data);
    }

    async updateInfoGem(distributor_id, data) {
        const existInfo = await this.getInfoGem(distributor_id);
        if (existInfo) {
            return existInfo.update(data);
        } else {
            return this.createInfoGem({ ...data, distributor_id });
        }
    }

    async createUserDistributor(data) {
        if (!data.email || !data.password || !data.name || !data.role_id) {
            throw new Error('Require params')
        }

        const existEmail = await MidUser.getUserByEmail(data.email);
        if (existEmail) {
            throw new Error('Email đã tồn tại')
        }

        if (data.password) {
            data.password = await hashPassword(data.password);
        }

        data.del = 0;
        data.status = 1;

        let newUser = await UserDistributor.create(data);
        await MidPermission.addUserRole({ userid: newUser.id, role_id: data.role_id });
        return newUser;
    }

    async getKeyDistributorAvail(distributor_id) {
        let result = await DistributerKey.findAll({
            where: {
                distributor_id: distributor_id,
                is_sell: 0,
                package_id: {
                    [Op.not]: 1
                }
            },
            group: ['package_id'],
            attributes: ['package_id', [sequelize.fn('COUNT', 'package_id'), 'count']]
        }).then()

        return result;
    }

    async getConditionToUplevel(distributor_id) {
        const distributor_level = await UserDistributor.findOne({
            where: {
                distributor_id: distributor_id,
                del: 0
            },
            attributes: ['level']
        });
        let Total_price = await Order.findAll({
            where: {
                distributor_buy_id: distributor_id,
                status: 1,
                type: 1
            },
            attributes: [
                [sequelize.fn('sum', sequelize.col('origin_price')), 'total_amount'],
            ],

            group: ['distributor_buy_id'],
            order: sequelize.literal('total_amount DESC'),

        }).map(u => u.get("total_amount"));
        var total = Total_price ? parseFloat(Total_price) : 0
        var condition = 0;
        switch (parseInt(distributor_level.level)) {
            case 2:
                condition = 1200000000 - total;
                break;
            case 3:
                condition = 200000000 - total;
                break;
        }
        return condition;
    }

    async getTotalPoints(distributor_id) {
        let Total_price = await Order.findAll({
            where: {
                distributor_buy_id: distributor_id,
                status: 1,
                type: 1
            },
            attributes: [
                [sequelize.fn('sum', sequelize.col('origin_price')), 'total_amount'],
            ],

            group: ['distributor_buy_id'],
            order: sequelize.literal('total_amount DESC'),

        }).map(u => u.get("total_amount"));
        var total = Total_price ? parseFloat(Total_price) : 0;
        
        return total;
    }

    async getDistributorByEmail(email) {
        return await UserDistributor.findOne({
            where: {
                email: email
            }
        })
    }
}

export default new MidDistributor()