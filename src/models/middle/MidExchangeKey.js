import { ExchangeKey, ExchangeKeyDetail, DistributerKey, ProductPackage, NotifyDetail } from '../core';
import { MidDistributor, MidKey } from '../middle';
class MidExchangeKey {
    async createExchangeKey(data, distributor_id) {
        let distributorData = await MidDistributor.getDistributorById(distributor_id);
        let parent_id = distributorData.parent_id;
        let dataCreate = {
            distributor_id,
            parent_id,
            del: 0,
            ...data,
            status: 0
        }
        // add notyfiDetail
        let dataCreateNotify = {
            content: distributorData.name + 'gửi yêu cầu đổi key',
            type: 1,
            status: 0
        }
        await NotifyDetail.create(dataCreateNotify)
        let exchangeResult = await ExchangeKey.create(dataCreate);
        return exchangeResult;
    }

    async getAllExchangeKeyDistributor(search, distributor_id) {
        let condition = {
            del: 0,
            parent_id: distributor_id
        }

        if (search.status || search.status == 0) {
            condition.status = parseInt(search.status);
        }

        let { page, limit } = search;
        page = page ? parseInt(page) : 1;
        limit = limit ? parseInt(limit) : 25;

        let includeOpt = [
        {
            association: 'distributor',
            required: true
        }]

        let result = await ExchangeKey.findAll({
            where: condition,
            include: includeOpt,
            order: [["id", "DESC"]],
            limit,
            offset: (page - 1) * limit
        })

        let total = await ExchangeKey.count({
            where: condition
        })

        return { result, total };
    }

    async confirmExchange(exchange_id, parent_id) {
        let exchange = await ExchangeKey.findOne({
            where: { 
                id: exchange_id,
                parent_id 
            }
        });

        if(!exchange){
            throw new Error("Mã đổi key không tồn tại");
        }

        const { package_exchange, package_receive } = exchange;
        const p_w_ex = package_exchange.map(it => {
            let conditionExchange = {
                package_id: parseInt(it.package_id),
                is_sell: 0,
                is_exchange: 0,
                distributor_id: exchange.distributor_id
            };
            return MidKey.getDistributorKeyLimit(conditionExchange, parseInt(it.quantity), 0)
        });

        const p_w_rc = package_receive.map(it => {
            let conditionExchange = {
                package_id: parseInt(it.package_id),
                is_sell: 0,
                is_exchange: 0,
                distributor_id: exchange.parent_id
            };
            if (exchange.parent_id) {
                return MidKey.getDistributorKeyLimit(conditionExchange, parseInt(it.quantity), 0)
            } else {
                return MidKey.getKeyLimit({
                    package_id: it.package_id,
                    is_sell: 0
                }, parseInt(it.quantity), 0);
            }
        });

        const dataCountKeyEx = await Promise.all(p_w_ex);

        let invalidKeyEx = false;
        dataCountKeyEx.forEach((it, idx) => {
            if (it.length < parseInt(package_exchange[idx].quantity)) {
                invalidKeyEx = true;
            }
        })

        if (invalidKeyEx) {
            throw new Error('Kho key của nhà phân phối không đủ key để trao đổi')
        }

        const dataCountKeyRe = await Promise.all(p_w_rc);

        let invalidKeyRc = false;
        dataCountKeyRe.forEach((it, idx) => {
            if (it.length < parseInt(package_receive[idx].quantity)) {
                invalidKeyRc = true;
            }
        })

        if (invalidKeyRc) {
            throw new Error('Kho key của bạn không đủ key để đổi')
        }

        let p_w_update = [];
        dataCountKeyEx.forEach((it, idx) => {
            it.forEach(item_update => {

                p_w_update.push(
                    item_update.update({ is_exchange: 1})
                );

                if (exchange.parent_id) {
                    p_w_update.push(
                        MidKey.createOneDistributorKey({ 
                            distributor_id: exchange.parent_id,
                            key_id: item_update.key_id,
                            package_id: item_update.package_id,
                            is_sell: 0,
                            is_exchange: 0,
                            license_key: item_update.license_key
                        })
                    )
                } else {
                    p_w_update.push(
                        MidKey.exchangeKeyToStore(item_update.key_id)
                    )
                }
            })
        })

        dataCountKeyRe.forEach((it, idx) => {
            it.forEach(item_update => {
                if (exchange.parent_id) {
                    p_w_update.push(
                        item_update.update({ is_exchange: 1 })
                    );
                } else {
                    p_w_update.push(
                        item_update.update({ is_sell: 1, order_id: 0 })
                    );
                }
                p_w_update.push(
                    MidKey.createOneDistributorKey({
                        distributor_id: exchange.distributor_id,
                        key_id: exchange.parent_id ? item_update.key_id : item_update.id,
                        package_id: item_update.package_id,
                        is_sell: 0,
                        is_exchange: 0,
                        license_key: item_update.license_key
                    })
                )
            })
        })

        await Promise.all(p_w_update);

         //add notify
         let distributorParent = await MidDistributor.getDistributorNameById(parent_id);
         let dataCreateNotify = {
         content: distributorParent.name + ' '+ 'đã xác nhận đổi key' ,
         type: 7,
         status: 0,
         distributor_id: exchange.distributor_id
         }
        await NotifyDetail.create(dataCreateNotify)

        return exchange.update({ status: 1 });
    }

    async cancelExchange(exchange_id, parent_id) {
        let exchange = await ExchangeKey.findOne({
            where: { 
                id: exchange_id,
                parent_id
            }
        });

        if(!exchange){
            throw new Error("Mã đổi key không tồn tại");
        }

        // Add notify
        let distributorParent = await MidDistributor.getDistributorNameById(parent_id);
        let dataCreateNotify = {
        content: distributorParent.name + ' '+ 'đã hủy yêu cầu đổi key' ,
        type: 7,
        status: 0,
        distributor_id: exchange.distributor_id
        }
       await NotifyDetail.create(dataCreateNotify)

        return exchange.update({ status: 2});
    }

    async cancelExchangeDistributor(exchange_id, distributor_id) {
        let exchange = await ExchangeKey.findOne({
            where: { 
                id: exchange_id,
                distributor_id
            }
        });

        if(!exchange){
            throw new Error("Mã đổi key không tồn tại");
        }

        return exchange.update({ status: 2});
    }
    
    async getRequestExchange(distributor_id, dataQuery){
        let { page, limit } = dataQuery;
        page = page ? parseInt(page) : 1;
        limit = limit ? parseInt(limit) : 10;

        let condition = {
            distributor_id
        }

        return await ExchangeKey.findAndCountAll({
            where: condition,
            order: [["id", "DESC"]],
            limit,
            offset: (page - 1) * limit
        })
    }
}
export default new MidExchangeKey();