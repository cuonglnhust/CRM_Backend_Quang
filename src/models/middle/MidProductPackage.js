import { ProductPackage } from '../core';
import { Op } from 'sequelize';

class MidProductPackage {
    
    getAllPackage() {
        return ProductPackage.findAll({
            where: {
                del: 0
            } 
        })
    }

    getAllPackageExchange() {
        return ProductPackage.findAll({
            where: {
                del: 0,
                id: {
                    [Op.not]: 1
                }
            } 
        })
    }
}

export default new MidProductPackage();