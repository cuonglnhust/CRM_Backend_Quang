import { Order, Product, OrderProduct, ProductPackage, DistributerKey, Distributor, NotifyDetail } from '../core';
import sequelize, { Op } from 'sequelize';
import { ERROR_MESSAGE } from '../../config/error';
import { MidCustomer, MidDistributor, MidProduct, MidDistributorLinkPayment, MidKey } from '../middle';
import { generateRandomCode } from '../../libs/random';
import { DISCOUNT_WHOLESALE } from '../../config/setting';
import { sendMailActiveOrder } from '../../libs/sendmail';

class MidOrder {
    createNewOrder(data) {
        data.del = 0;
        return Order.create(data);
    }

    getOrderById(order_id) {
        return Order.findOne({
            where: { id: order_id }
        })
    }

    getOrderByCode(code) {
        return Order.findOne({
            where: { code },
            include: ['productData']
        })
    }

    getOrderWithCondition(cond) {
        return Order.findAll({
            where: cond
        })
    }

    countOrderWithCondition(cond) {
        return Order.count({
            where: cond
        })
    }

    totalPriceWithCondition(cond) {
        return Order.sum('total_price', {
            where: cond
        })
    }

    async searchOrders(search = {}) {
        let condition = {
            del: 0,
            type: 0
        }

        let { page, limit } = search;
        page = page ? parseInt(page) : 1;
        limit = limit ? parseInt(limit) : 25;

        if (search.distributor_id) {
            condition.distributor_id = search.distributor_id;
        }

        if (search.distributor_buy_id) {
            condition.distributor_buy_id = search.distributor_buy_id;
        }

        if (search.status || (search.status == 0 && !isNaN(parseInt(search.status)) )) {
            condition.status = parseInt(search.status);
        }

        if (search.code) {
            condition.code = {
                [Op.like]: `%${search.code}%`
            }
        }

        if (search.start && search.end) {
            condition.createdAt = {
                [Op.between]: [new Date(search.start), new Date(search.end)]
            }
        }

        let includeOpt = [{
            association: 'distributor',
            required: false
        }, {
            association: 'productData',
            required: true,
            where: search.package_id ? { package_id: search.package_id } : {}
        }]

        if (search.type && search.type != '0') {
            condition.type = parseInt(search.type);
            includeOpt.push({
                model: Distributor,
                as: 'distributorBuy',
                where: search.email ? { email: { [Op.like] : `%${search.email}%` } } : {}
            })

            if (search.type_sell == 1) {
                condition.distributor_id = 0;
            } else if (search.type_sell == 2) {
                condition.distributor_id = {
                    [Op.gt]: 0
                };
            }
        }else{
            let customerCondition = {};
            if(search.email && search.email != ''){
                customerCondition.email = { [Op.like] : `%${search.email}%` };
            }
            if(search.mobile && search.mobile != ''){
                customerCondition.mobile = { [Op.like] : `%${search.mobile}%` }
            }
            includeOpt.push({
                association: 'customer',
                required: search.email || search.mobile ? true: false,
                where: customerCondition
            })
        }

        const [listOder, total] = await Promise.all([
            Order.findAll({
                where: condition,
                order: [["id", "DESC"]],
                include: includeOpt,
                limit,
                offset: (page - 1) * limit
            }),
            Order.count({
                where: condition,
                include: includeOpt
            })
        ]);

        return {
            listOder,
            total: total || 0
        }
    }

    async getOrderBuyOfDistributor(distributor_id, dataSearch = {}) {
        let condition = {
            distributor_buy_id: distributor_id,
            del: 0,
            type: 1
        }

        let { page, limit } = dataSearch;
        page = page ? parseInt(page) : 1;
        limit = limit ? parseInt(limit) : 25;

        if (dataSearch.status || dataSearch.status == 0) {
            condition.status = parseInt(dataSearch.status);
        }

        if (dataSearch.code) {
            condition.code = {
                [Op.like]: `%${dataSearch.code}%`
            }
        }

        if (dataSearch.package_id) {
            condition.package_id = dataSearch.package_id;
        }

        if (dataSearch.product_id) {
            condition.product_id = dataSearch.product_id;
        }

        if (dataSearch.start && dataSearch.end) {
            condition.createdAt = {
                [Op.between]: [new Date(dataSearch.start), new Date(dataSearch.end)]
            }
        }

        let includeOpt = [{
            association: 'productData',
            required: true,
            where: dataSearch.package_id ? { package_id: dataSearch.package_id } : {}
        }]

        const [listOrder, total] = await Promise.all([
            Order.findAll({
                where: condition,
                order: [["id", "DESC"]],
                include: includeOpt,
                limit,
                offset: (page - 1) * limit
            }),
            Order.count({
                where: condition
            })
        ]);

        return {
            listOrder,
            total: total || 0
        }
    }

    async addProductForOrder(data) {
        return OrderProduct.create(data);
    }

    async getOrderProduct(order_id) {
        return OrderProduct.findAll({
            where: {
                order_id
            }
        })
    }

    async createNewOrderRetail(distributor_id, dataOrder) {
        if (!dataOrder.name || !dataOrder.email || !dataOrder.mobile || !dataOrder.package_id) {
            throw new Error(ERROR_MESSAGE.CREATE_ORDER_RETAIL.ERR_REQUIRE);
        }

        const packageData = await MidProduct.getPackageById(dataOrder.package_id);
        if (!packageData) {
            throw new Error(ERROR_MESSAGE.CREATE_ORDER_RETAIL.ERR_REQUIRE);
        }

        const dataCustomer = {
            email: dataOrder.email,
            name: dataOrder.name,
            mobile: dataOrder.mobile
        }

        const customer_id = await MidCustomer.getCustomerIdByEmail(dataCustomer);
        const dataInsert = {
            userid: customer_id,
            distributor_id: distributor_id || null,
            type: 0,
            status: 0,
            del: 0,
            status: 0,
            quantity: 1,
            total_price: packageData.price,
            code: generateRandomCode()
        }

        const newOrder = await Order.create(dataInsert);
        await this.addProductForOrder({
            order_id: newOrder.id,
            quantity: 1,
            price: packageData.price,
            total_price: packageData.price,
            product_id: packageData.product_id,
            package_id: packageData.id
        });

        return newOrder;
    }

    async createOrderWholeSale(distributor_id, level, dataOrder) {
        if (!dataOrder.distributor_buy_id || !dataOrder.products) {
            throw new Error(ERROR_MESSAGE.CREATE_ORDER_RETAIL.ERR_REQUIRE);
        }

        const products = dataOrder.products.map(async (it) => {
            const productItem = await MidProduct.getPackageById(it.package_id);
            it.packageData = productItem;
            return it;
        })

        const dataProducts = await Promise.all(products); 
        const isInvalidProduct = dataProducts.filter(it => !it.packageData);
        if (isInvalidProduct.length) {
            throw new Error(ERROR_MESSAGE.CREATE_ORDER_RETAIL.ERR_REQUIRE);
        }

        // const [ packageData, distributorBuy] = await Promise.all([
        //     MidProduct.getPackageById(package_id),
        //     MidDistributor.getDistributorById(dataOrder.distributor_buy_id)
        // ])
        // if (!packageData || !distributorBuy) {
        //     throw new Error(ERROR_MESSAGE.CREATE_ORDER_RETAIL.ERR_REQUIRE);
        // }

        let originPrice = 0;
        let totalQuantity = 0;
        dataProducts.forEach(it => {
            originPrice += it.packageData.price * parseInt(it.quantity);
            totalQuantity += parseInt(it.quantity);
        });

        const discount = DISCOUNT_WHOLESALE[level];
        const totalPrice = originPrice - (discount / 100) * originPrice;

        const dataInsert = {
            userid: 0,
            distributor_id,
            distributor_buy_id: dataOrder.distributor_buy_id,
            type: 1,
            status: 0,
            discount,
            total_price: totalPrice,
            origin_price: originPrice,
            quantity: totalQuantity,
            del: 0,
            status: 0,
            code: generateRandomCode()
        }

        const newOrder = await Order.create(dataInsert);
        const insertProductOrder = dataProducts.map(it => {
            return this.addProductForOrder({
                order_id: newOrder.id,
                product_id: it.packageData.product_id,
                package_id: it.package_id,
                quantity: it.quantity,
                price: it.packageData.price,
                total_price: it.packageData.price * parseInt(it.quantity)
            })
        })
        
        await Promise.all(insertProductOrder);

         //add notify
        let distributorName = await MidDistributor.getDistributorById(distributor_id);
        //let distributorBy = await MidDistributor.getDistributorById(distributor_buy_id);
        
        let dataCreateNotify = {
            content: distributorName.name + ' '+ 'đã tạo đơn hàng mua sỉ cho đại lý cấp dưới ',
            type: 5,
            distributor_id: distributorName.parent_id,
            status: 0
        }
        await NotifyDetail.create(dataCreateNotify)
        return newOrder;
    }

    async createWholeSale(distributor_id, distributor_buy_id, level, dataOrder) {
        const products = dataOrder.products.map(async (it) => {
            const productItem = await MidProduct.getPackageById(it.package_id);
            it.packageData = productItem;
            return it;
        })

        const dataProducts = await Promise.all(products);
        const isInvalidProduct = dataProducts.filter(it => !it.packageData);
        if (isInvalidProduct.length) {
            throw new Error(ERROR_MESSAGE.CREATE_ORDER_RETAIL.ERR_REQUIRE);
        }

        let originPrice = 0;
        let totalQuantity = 0;
        dataProducts.forEach(it => {
            originPrice += it.packageData.price * parseInt(it.quantity);
            totalQuantity += parseInt(it.quantity);
        });

        const discount = DISCOUNT_WHOLESALE[level];
        const totalPrice = originPrice - (discount / 100) * originPrice;

        const dataInsert = {
            userid: 0,
            distributor_id,
            distributor_buy_id,
            type: 1,
            status: 0,
            discount,
            total_price: totalPrice,
            origin_price: originPrice,
            quantity: totalQuantity,
            del: 0,
            status: 0,
            code: generateRandomCode()
        }
        
        const newOrder = await Order.create(dataInsert);
        const insertProductOrder = dataProducts.map(it => {
            return this.addProductForOrder({
                order_id: newOrder.id,
                product_id: it.packageData.product_id,
                package_id: it.package_id,
                quantity: it.quantity,
                price: it.packageData.price,
                total_price: it.packageData.price * parseInt(it.quantity)
            })
        })

        //add notify
        //let distributorParent = await MidDistributor.getDistributorById(distributor_id);
        let distributorBy = await MidDistributor.getDistributorById(distributor_buy_id);
        
        let dataCreateNotify = {
            content: distributorBy.name + ' '+ 'đã tạo đơn hàng mua sỉ ',
            type: 6,
            status: 0, 
            distributor_id: distributor_id
        }
        await NotifyDetail.create(dataCreateNotify)
        //
        await Promise.all(insertProductOrder);
        return newOrder;
    }

    async confirmPayment(distributor_id, dataOrder) {
        if (!dataOrder.order_id) {
            throw new Error('Yêu cầu không hợp lệ!')
        }

        dataOrder.type_payment = dataOrder.type_payment || "";

        const orderData = await this.getOrderById(dataOrder.order_id);
        if (!orderData) {
            throw new Error('Đơn hàng không tồn tại')
        }

        if (orderData.status != 0) {
            throw new Error('Yêu cầu không hợp lệ!')
        }

        if (distributor_id && orderData.distributor_id != distributor_id) {
            throw new Error('Yêu cầu không hợp lệ!')
        }

        const listPackage = await this.getOrderProduct(dataOrder.order_id);
        if (!listPackage.length) {
            throw new Error('Đơn hàng không hợp lệ')
        }
        if (orderData.type == 0) {
            let conditionKey = {
                package_id: listPackage[0].package_id,
                is_sell: 0,
                is_exchange: 0,
                distributor_id
            };

            let existKey = null;
            if (distributor_id) {
                existKey = await MidKey.getOneKeyDistributor(conditionKey);
            } else {
                existKey = await MidKey.getOneKeyWithCondition({ package_id: listPackage[0].package_id });
            }

            if (!existKey) {
                throw new Error('Không còn key để chuyển cho đơn hàng');
            }

            const p_w = [
                orderData.update({ status: 1, note_pay: dataOrder.type_payment }),
                existKey.update({ is_sell: 1, order_id: dataOrder.order_id })
            ];

            sendMailActiveOrder({ 
                package_id: listPackage[0].package_id,
                distributor_id: distributor_id,
                license_key: existKey.license_key,
                userid: orderData.userid
            })

            //SendMail
            // let conditionCus = {
            //     id: dataOrder.userid
            // };
            // let customer_buy = MidCustomer.getCustomerByCondition(conditionCus)
            // let DistributorSell = MidDistributor.getDistributorById(orderData.distributor_id)
            // let DataSend = {
            //     Customer: customer_buy.name, 
            //     DistributorSell: DistributorSell.name, 
            //     OrderCode: orderData.code, 
            //     existKey
            // }
            // let infoSend = await SendMail(DataSend, customer_buy.email)
            // console.log(infoSend)
            //SendMail
            return Promise.all(p_w);
        } else {
            const p_w = listPackage.map(it => {
                let conditionKey = {
                    package_id: it.package_id,
                    is_sell: 0,
                    is_exchange: 0,
                    distributor_id
                };
                if (distributor_id) {
                    return MidKey.getDistributorKeyLimit(conditionKey, parseInt(it.quantity), 0)
                } else {
                    return MidKey.getKeyLimit({
                        package_id: it.package_id,
                        is_sell: 0
                    }, parseInt(it.quantity), 0);
                }
            });

            const dataCountKey = await Promise.all(p_w);

            let invalidKey = false;
            dataCountKey.forEach((it, idx) => {
                if (it.length < parseInt(listPackage[idx].quantity)) {
                    invalidKey = true;
                }
            })

            if (invalidKey) {
                throw new Error('Số lượng key không đủ cho đơn hàng!')
            }

            let p_w_update = [];
            dataCountKey.forEach((it, idx) => {
                it.forEach(item_update => {
                    p_w_update.push(
                        item_update.update({ is_sell: 1, order_id: orderData.id })
                    );
                    p_w_update.push(
                        MidKey.createOneDistributorKey({
                            distributor_id: orderData.distributor_buy_id,
                            key_id: distributor_id ? item_update.key_id : item_update.id,
                            package_id: item_update.package_id,
                            is_sell: 0,
                            license_key: item_update.license_key,
                            is_exchange: 0
                        })
                    )
                })
            })

             //add notify
            let distributorParent = await MidDistributor.getDistributorNameById(orderData.distributor_id);
            //let distributorBy = await MidDistributor.getDistributorById(distributor_buy_id);
        
            let dataCreateNotify = {
            content: distributorParent.name + ' '+ 'đã xác nhận đơn mua hàng' + ' ' + distributorBy.name,
            type: 4,
            status: 0, 
            distributor_id: orderData.distributor_buy_id
            }
            await NotifyDetail.create(dataCreateNotify)


            await this.checkLevelDistributor(orderData.origin_price, orderData.distributor_buy_id);
            p_w_update.push(
                orderData.update({ status: 1, note_pay: dataOrder.type_payment })
            );

            return Promise.all(p_w_update);
        }
    }

    async updateLevel(distributor_id, level){
        let objUpdate = await Distributor.findOne({
            where:{
                id: distributor_id
            }
        })

        await objUpdate.update({level});
    }

    async cancelOrder(distributor_id, dataOrder) {
        if (!dataOrder.order_id) {
            throw new Error('Yêu cầu không hợp lệ!')
        }

        const orderData = await this.getOrderById(dataOrder.order_id);
        if (!orderData) {
            throw new Error('Don hang khong ton tai')
        }

        if (orderData.status != 0) {
            throw new Error('Yêu cầu không hợp lệ!')
        }

        if (distributor_id && orderData.distributor_id != distributor_id && orderData.distributor_buy_id != distributor_id) {
            throw new Error('Yêu cầu không hợp lệ!')
        }

          //add notify
          let distributorParent = await MidDistributor.getDistributorNameById(orderData.distributor_id);
          //let distributorBy = await MidDistributor.getDistributorById(distributor_buy_id) 
          let dataCreateNotify = {
          content: distributorParent.name + ' '+ 'đã hủy đơn hàng' + ' ' + orderData.code,
          type: 4,
          status: 0,
          distributor_id: orderData.distributor_buy_id
          }
          await NotifyDetail.create(dataCreateNotify)

        return orderData.update({ status: 2, note_pay: dataOrder.reason || "" });
    }

    async createOrderGuest(dataOrder) {
        if (!dataOrder.code || !dataOrder.name || !dataOrder.email || !dataOrder.mobile) {
            throw new Error('')
        }

        const dataLink = await MidDistributorLinkPayment.getLinkByCode(dataOrder.code);
        if (!dataLink) {
            throw new Error('')
        }

        const dataInsert = {
            package_id: dataLink.package_id,
            name: dataOrder.name,
            email: dataOrder.email,
            mobile: dataOrder.mobile
        };

        const newOrder = await this.createNewOrderRetail(dataLink.distributor_id, dataInsert);
        return newOrder;
    }

    async getOrderPaymentInfo(code) {
        const orderData = await this.getOrderByCode(code);
        if (!orderData) {
            throw new Error('Đơn hàng không tồn tại');
        }

        const distributor_id = orderData.distributor_id;
        if (!distributor_id) {
            throw new Error('Đơn hàng không tồn tại');
        }

        const [paymentBank, paymentGem] = await Promise.all([
            MidDistributor.getInfoPayment(distributor_id),
            MidDistributor.getInfoGem(distributor_id)
        ])
        return {
            orderData,
            paymentBank,
            paymentGem
        }
    }

    async getOrderKey(code) {
        const orderData = await this.getOrderByCode(code);
        if (!orderData) {
            throw new Error('Code invalid');
        }

        return MidKey.getKeyOfOrder(orderData.id);
    }

    async activeOrder(order_id, note_pay) {
        const orderData = await this.getOrderById(order_id);
    }
    async checkLevelDistributor(origin_price, distributor_id) {
        let condition = {
            distributor_buy_id : distributor_id,
            type: 1,
            status: 1
        }
        const distributor = await Distributor.findOne({
           where: {
               id: distributor_id
            }
        })

        if (distributor.level === 1) {
            return;
        }

        const sumTotal = await Order.sum('origin_price', {
            where: condition
        })

        const total_price = origin_price + sumTotal;

        if( distributor.level === 2 && total_price >= 1200000000){
            distributor.update({ level: 1 })
        }
        else if(distributor.level === 3 && total_price >= 200000000){
            distributor.update({ level: 2 })
        }
    }
    async changePackage(distributor_id, dataQuery) {

        // if(!dataQuery.id_package_old|| !dataQuery.id_package_new || dataQuery.order_id){
        //     throw new Error(ERROR_MESSAGE.CREATE_ORDER_RETAIL.ERR_REQUIRE);
        // }
        // const queryProduct = await OrderProduct.findOne({
        //     where: {
        //         package_id:dataQuery.id_package_old,
        //         order_id: order_id
        //     },
        //     include: {
        //         model:Order,
        //         as : 'order', 
        //         where: {distributor_id: distributor_id}
        //     }
        // }); 
        // const product_new = await ProductPackage.findOne({
        //     where: {id:dataQuery.id_package_new}
        // }); 
        // let price_product_new = product_new.price;
        // let totalPriceOld = queryProduct.total_price;
        // let quantity_new = totalPriceOld/price_product_new


    }

}

export default new MidOrder();