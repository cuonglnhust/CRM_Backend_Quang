import { ProductKey, DistributerKey,ProductPackage } from '../core';
import { MidProduct, MidProductPackage } from './';
import { Op } from 'sequelize';

class MidKey {
    getKeyWithCondition(cond) {
        return ProductKey.findAll({
            where: cond
        })
    }

    getOneKeyWithCondition(cond) {
        return ProductKey.findOne({
            where: cond
        });
    }

    countKeyWithCondition(cond) {
        return ProductKey.count({
            where: cond
        })
    }

    getKeyLimit(cond, limit, offset) {
        return ProductKey.findAll({
            where: cond,
            limit,
            offset
        })
    }

    getDistributorKeyLimit(cond, limit, offset) {
        return DistributerKey.findAll({
            where: cond,
            limit,
            offset
        })
    }

    getDistributorKeyWithCondition(cond) {
        return DistributerKey.findAll({
            where: cond
        })
    }

    countKeyDistributorWithCondition(cond) {
        return DistributerKey.count({
            where: cond
        })
    }

    updateKey(data, cond) {
        return ProductKey.update(data, cond);
    }

    updateDistributorKey(data, cond) {
        return DistributerKey.update(data, cond);
    }

    createListRecord(records) {
        return ProductKey.bulkCreate(records);
    }

    createDistributorKey(records) {
        return DistributerKey.bulkCreate(records);
    }

    createOneDistributorKey(records) {
        return DistributerKey.create(records);
    }

    async searchKey(dataSearch) {
        let condition = {
            distributor_id: dataSearch.distributor_id || 0
        };

        if (dataSearch.key) {
            condition.license_key = {
                [Op.like]: `%${dataSearch.key}%`
            }
        }

        if (dataSearch.package_id) {
            condition.package_id = dataSearch.package_id;
        }

        if (dataSearch.is_sell || dataSearch.is_sell == 0) {
            condition.is_sell = dataSearch.is_sell;
        }

        let { page, limit } = dataSearch;
        page = page ? parseInt(page) : 1;
        limit = limit ? parseInt(limit) : 25;

        const [ rows, total ] = await Promise.all([
            ProductKey.findAll({
                where: condition,
                order: [["id", "DESC"]],
                limit,
                offset: (page - 1) * limit
            }),
            ProductKey.count({
                where: condition
            })
        ]);

        return {
            rows,
            total: total || 0
        }
    }

    async searchKeyDistributor(dataSearch) {
        let condition = {
            distributor_id: dataSearch.distributor_id || 0
        };

        if (dataSearch.distributor_id) {
            condition.is_exchange = 0;
        }

        if (dataSearch.key) {
            condition.license_key = {
                [Op.like]: `%${dataSearch.key}%`
            }
        }

        if (dataSearch.package_id) {
            condition.package_id = dataSearch.package_id;
        }

        if (dataSearch.is_sell || dataSearch.is_sell == 0) {
            condition.is_sell = dataSearch.is_sell;
        } 

        let { page, limit } = dataSearch;
        page = page ? parseInt(page) : 1;
        limit = limit ? parseInt(limit) : 25;

        const [ rows, total ] = await Promise.all([
            DistributerKey.findAll({
                where: condition,
                order: [["id", "DESC"]],
                limit,
                offset: (page - 1) * limit
            }),
            DistributerKey.count({
                where: condition
            })
        ]);

        return {
            rows,
            total: total || 0
        }
    }
    
    async getKeyStoreDistributor(distributor_id) {
        const listPackage = await MidProductPackage.getAllPackage();
        const p_w = listPackage.map(it => {
            return this.countKeyWithCondition({ distributor_id, package_id: it.id, is_sell: 0 })
        })

        const dataKey = await Promise.all(p_w);
        return dataKey.map((it, idx) => {
            return {
                total: it || 0,
                package_id: listPackage[idx].id,
                package_name: listPackage[idx].name
            }
        })
    }

    getOneKeyDistributor(condition) {
        return DistributerKey.findOne({
            where: condition
        })
    }

    createDistributorKey(data) {
        return DistributerKey.create(data);
    }

    async exchangeKeyToStore(key_id) {
        let existKey = await this.getOneKeyWithCondition({ id: key_id })
        if (!existKey) return false;

        return existKey.update({ is_sell: 0, order_id: 0 });
    }

    async getKeyOfOrder(order_id) {
        const [ keySystem, keyDistributer ] = await Promise.all([
            this.getKeyWithCondition({ is_sell: 1, order_id }),
            this.getDistributorKeyWithCondition({ is_sell: 1, order_id })
        ]);

        let allKey = keySystem.concat(keyDistributer);
        let dataPackage = {};
        allKey.forEach(item => {
            let dataPk = dataPackage[item.package_id];
            if (dataPk) {
                dataPk.push(item);
            } else {
                dataPk = [item];
            }

            dataPackage[item.package_id] = dataPk;
        });

        return Object.keys(dataPackage).map(it => {
            return {
                package_id: it,
                dataKey: dataPackage[it]
            }
        })
    }

   async getStatisticalDistributorKey(distributor_id) {
      
        let condition = {
           distributor_id : parseInt(distributor_id),
           is_exchange: 0
        };
        var totalKey =  await DistributerKey.count({
            where: condition       
        })
        const [Key1M,sold1M, notsold1M ] = await Promise.all([
           
            DistributerKey.count({
                where: {
                    package_id: 1,
                    distributor_id : parseInt(distributor_id),
                    is_exchange: 0
                }
            
            }), 
            DistributerKey.count({
                where: {
                    package_id: 1,
                    is_sell:1,
                    is_exchange: 0,
                    distributor_id : parseInt(distributor_id)
                }
               
            }), 
            DistributerKey.count({
                where: {
                    package_id: 1,
                    is_sell:0,
                    is_exchange: 0,
                    distributor_id : parseInt(distributor_id)
                }
               
            })
           
        ]);
        const [Key3M,sold3M, notsold3M ] = await Promise.all([
           
            DistributerKey.count({
                where: {
                    package_id: 2,
                    is_exchange: 0,
                    distributor_id : parseInt(distributor_id)
                }
            
            }), 
            DistributerKey.count({
                where: {
                    package_id: 2,
                    is_sell:1,
                    is_exchange: 0,
                    distributor_id : parseInt(distributor_id)
                }
               
            }), 
            DistributerKey.count({
                where: {
                    package_id: 2,
                    is_sell:0,
                    is_exchange: 0,
                    distributor_id : parseInt(distributor_id)
                }
               
            })
           
        ]);
        const [Key1Y,sold1Y, notsold1Y ] = await Promise.all([
           
            DistributerKey.count({
                where: {
                    package_id: 3,
                    is_exchange: 0,
                    distributor_id : parseInt(distributor_id)
                }
            
            }), 
            DistributerKey.count({
                where: {
                    package_id: 3,
                    is_sell:1, 
                    is_exchange: 0,
                    distributor_id : parseInt(distributor_id)
                }
               
            }), 
            DistributerKey.count({
                where: {
                    package_id: 3,
                    is_sell:0,
                    is_exchange: 0,
                    distributor_id : parseInt(distributor_id)
                }
               
            })
           
        ]);
        const [KeyFe,soldFe, notsoldFe ] = await Promise.all([
           
            DistributerKey.count({
                where: {
                    package_id: 4,
                    is_exchange: 0,
                    distributor_id : parseInt(distributor_id)
                }
            
            }), 
            DistributerKey.count({
                where: {
                    package_id: 4,
                    is_sell:1,
                    is_exchange: 0,
                    distributor_id : parseInt(distributor_id)
                }
               
            }), 
            DistributerKey.count({
                where: {
                    package_id: 4,
                    is_sell:0,
                    is_exchange: 0,
                    distributor_id : parseInt(distributor_id)
                }
               
            })
           
        ]);

        
        return {
            totalKey,
            Key1M,
            sold1M, 
            notsold1M,
            Key3M,
            sold3M, 
            notsold3M,
            Key1Y,
            sold1Y, 
            notsold1Y,
            KeyFe,
            soldFe, 
            notsoldFe,

        }
    }
    async getStatisticalKey() {
        let condition = {
            is_exchange: 0
        };
        var totalKey =  await ProductKey.count({
            where: condition       
        })
        const [Key1M,sold1M, notsold1M ] = await Promise.all([
           
            ProductKey.count({
                where: {
                    package_id: 1,
                }
            
            }), 
            ProductKey.count({
                where: {
                    package_id: 1,
                    is_sell:1
                }
               
            }), 
            ProductKey.count({
                where: {
                    package_id: 1,is_sell:0
                }
               
            })
           
        ]);
        const [Key3M,sold3M, notsold3M ] = await Promise.all([
           
            ProductKey.count({
                where: {
                    package_id: 2
                }
            
            }), 
            ProductKey.count({
                where: {
                    package_id: 2,
                    is_sell:1
                }
               
            }), 
            ProductKey.count({
                where: {
                    package_id: 2,is_sell:0
                }
               
            })
           
        ]);
        const [Key1Y,sold1Y, notsold1Y ] = await Promise.all([
           
            ProductKey.count({
                where: {package_id: 3}
            
            }), 
            ProductKey.count({
                where: {package_id: 3,is_sell:1}
               
            }), 
            ProductKey.count({
                where: {package_id: 3,is_sell:0}
               
            })
           
        ]);
        const [KeyFe,soldFe, notsoldFe ] = await Promise.all([
           
            ProductKey.count({
                where: {package_id: 4}
            
            }), 
            ProductKey.count({
                where: {package_id: 4,is_sell:1}
               
            }), 
            ProductKey.count({
                where: {package_id: 4,is_sell:0}
               
            })
           
        ]);

        
        return {
            totalKey,
            Key1M,
            sold1M, 
            notsold1M,
            Key3M,
            sold3M, 
            notsold3M,
            Key1Y,
            sold1Y, 
            notsold1Y,
            KeyFe,
            soldFe, 
            notsoldFe,

        }
    }
}

export default new MidKey();