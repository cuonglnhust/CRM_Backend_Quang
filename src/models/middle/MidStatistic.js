import { Order, Product, ProductPackage } from '../core';
import MidOrder from './MidOrder';
import sequelize, { Op } from 'sequelize';
import { nowDate, addDay, subtractDay, getTimestamp, unixToTime, convertTimeDate } from '../../libs/timezone';
import { getDaysArray, appendLeadingZeroes } from '../../libs/datecommon';

class MidStatistic{
    async getStatisticOrder(start, end, distributor_id) {
        let currDate = nowDate();
		let dataEndCheck = end || currDate;
		let dateEnd = addDay(dataEndCheck, 1);
		let dateStart = start || subtractDay(currDate, 9);
        
        const allOrders = await MidOrder.getOrderWithCondition({
            distributor_id,
            createdAt: {
                [Op.between]: [ convertTimeDate(dateStart), convertTimeDate(dateEnd) ]
            }
        })

        return allOrders;
    }

    async getDataOrderDistributor(distributor_id, data) {

        if (!data.start || !data.end) {
            throw new Error('Require params');
        }

        var lstDateResult = [];
        var listDate = getDaysArray(data.start, data.end) // get list date
        for (let i = 0; i < listDate.length; i++){
            let date =listDate[i].getFullYear() + "-" + appendLeadingZeroes(listDate[i].getMonth() + 1) + "-" + appendLeadingZeroes(listDate[i].getDate() -1);
            lstDateResult.push(date);
        }
        var dataRetail = [];
        var dataWholesale = [];
        var dataTotal = [];
        let totalAll = 0;
        let totalRetail = 0;
        let totalWholeSale = 0; 
        for (let i = 0; i < listDate.length; i++) {
            let formatted_date_start = listDate[i].getFullYear() + "-" + appendLeadingZeroes(listDate[i].getMonth() + 1) + "-" + appendLeadingZeroes(listDate[i].getDate() -1);
            let formatted_date_end = listDate[i].getFullYear() + "-" + appendLeadingZeroes(listDate[i].getMonth() + 1) + "-" + appendLeadingZeroes(listDate[i].getDate() -1);
            
            let lstRetail = await Order.findAll({
                where: {
                    distributor_id,
                    status: 1,
                    type : 0,
                    createdAt: {
                        [Op.between]:[new Date(formatted_date_start + 'T00:00:00.000Z'), new Date(formatted_date_end + 'T23:59:59.000Z')]
                    }
                }
                //where : conditionSuccess
            })
            let lstWholesale = await Order.findAll({
                where: {
                    distributor_id,
                    status: 1, 
                    type : 1,
                    createdAt: {                        
                        [Op.between]:[new Date(formatted_date_start + 'T00:00:00.000Z'), new Date(formatted_date_end + 'T23:59:59.000Z')]
                    }
                }
                //where: conditionPending
                
            })
            let Retail = 0
            let Wholesale = 0
            let total = 0
            
            for(let i = 0; i < lstRetail.length; i++){
                Retail += lstRetail[i].total_price
            }
            for(let i = 0; i < lstWholesale.length; i++){
                Wholesale += lstWholesale[i].total_price
            }
            total = Retail + Wholesale;
            dataRetail.push(Retail)
            dataWholesale.push(Wholesale)
            dataTotal.push(total)

            totalRetail += Retail || 0;
            totalWholeSale += Wholesale || 0;
            totalAll += total || 0;

        }

        return {
            lstDateResult,
            dataRetail,
            dataWholesale, 
            dataTotal, 
            totalAll,
            totalWholeSale,
            totalRetail
        };
    }

    async getDataOrderChart(distributor_id, data) {

        if (!data.start || !data.end) {
            throw new Error('Require params');
        }

        var lstDateResult = [];
        var listDate = getDaysArray(data.start, data.end) // get list date
        for (let i = 0; i < listDate.length; i++){
            let date =listDate[i].getFullYear() + "-" + appendLeadingZeroes(listDate[i].getMonth() + 1) + "-" + appendLeadingZeroes(listDate[i].getDate() -1);
            lstDateResult.push(date);
        }
        var dataPay = [];
        var dataPending = [];
        var dataCancel = [];
        var totalPay = 0; 
        var totalOrder = 0;
        for (let i = 0; i < listDate.length; i++) {
            let formatted_date_start = listDate[i].getFullYear() + "-" + appendLeadingZeroes(listDate[i].getMonth() + 1) + "-" + appendLeadingZeroes(listDate[i].getDate() -1);
            let formatted_date_end = listDate[i].getFullYear() + "-" + appendLeadingZeroes(listDate[i].getMonth() + 1) + "-" + appendLeadingZeroes(listDate[i].getDate() -1);
            const [totalSuccess, totalPending, totalCancel] = await Promise.all([
                Order.count({
                    where: {
                        distributor_id,
                        status: 1,
                        createdAt: {
                            [Op.between]:[new Date(formatted_date_start + 'T00:00:00.000Z'), new Date(formatted_date_end + 'T23:59:59.000Z')]
                        }
                    }
                })
                ,
                Order.count({
                    where: {
                        distributor_id,
                        status: 0, 
                        createdAt: {                        
                            [Op.between]:[new Date(formatted_date_start + 'T00:00:00.000Z'), new Date(formatted_date_end + 'T23:59:59.000Z')]
                        }
                    }
                    
                }), 
                Order.count({
                    where: {
                        distributor_id,
                        status: 2, 
                        createdAt: {                        
                            [Op.between]:[new Date(formatted_date_start + 'T00:00:00.000Z'), new Date(formatted_date_end + 'T23:59:59.000Z')]
                        }
                    }
                    
                })
            ]);        
            dataPay.push(totalSuccess)
            dataPending.push(totalPending)
            dataCancel.push(totalCancel)

            totalPay += totalSuccess || 0;
            totalOrder += (totalSuccess || 0 + totalPending || 0 + totalCancel || 0)
        }

        return {
            lstDateResult,
            dataPay,
            dataPending, 
            dataCancel,
            totalPay,
            totalOrder
        };
    }

    async getDataOrderChartDashboard(distributor_id, data) {

        if (!data.start || !data.end) {
            throw new Error('Require params');
        }

        var lstDateResult = [];
        var listDate = getDaysArray(data.start, data.end) // get list date
        for (let i = 0; i < listDate.length; i++){
            let date =listDate[i].getFullYear() + "-" + appendLeadingZeroes(listDate[i].getMonth() + 1) + "-" + appendLeadingZeroes(listDate[i].getDate() -1);
            lstDateResult.push(date);
        }
        var dataRetail = [];
        var dataWholseSale = [];
        var totalRetail = 0; 
        var totalWholeSale = 0;
        for (let i = 0; i < listDate.length; i++) {
            let formatted_date_start = listDate[i].getFullYear() + "-" + appendLeadingZeroes(listDate[i].getMonth() + 1) + "-" + appendLeadingZeroes(listDate[i].getDate() -1);
            let formatted_date_end = listDate[i].getFullYear() + "-" + appendLeadingZeroes(listDate[i].getMonth() + 1) + "-" + appendLeadingZeroes(listDate[i].getDate() -1);
            const [countRetail, countWholeSale] = await Promise.all([
                Order.count({
                    where: {
                        distributor_id,
                        createdAt: {
                            [Op.between]:[new Date(formatted_date_start + 'T00:00:00.000Z'), new Date(formatted_date_end + 'T23:59:59.000Z')]
                        },
                        type: 0
                    }
                })
                ,
                Order.count({
                    where: {
                        distributor_id,
                        createdAt: {                        
                            [Op.between]:[new Date(formatted_date_start + 'T00:00:00.000Z'), new Date(formatted_date_end + 'T23:59:59.000Z')]
                        },
                        type: 1
                    }
                    
                })
            ]);        
            dataRetail.push(countRetail)
            dataWholseSale.push(countWholeSale)

            totalRetail += countRetail || 0;
            totalWholeSale += countWholeSale || 0;
        }

        return {
            lstDateResult,
            dataRetail,
            dataWholseSale, 
            totalWholeSale,
            totalRetail
        };
    }

    async getTopDistributor() {
        return Order.findAll({
            where: {
                distributor_id: {
                    [Op.gt]: 0
                },
                status: 1,
                total_price: {
                    [Op.gt]: 0
                }
            },
            attributes: [
              'distributor_id',
              [sequelize.fn('sum', sequelize.col('total_price')), 'total_amount'],
            ],
            include: ['distributor'],
            group: ['distributor_id'],
            order: sequelize.literal('total_amount DESC'),
            limit: 10,
            offset: 0
        });     
    }
}

export default new MidStatistic();