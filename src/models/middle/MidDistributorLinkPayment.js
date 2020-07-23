import { DistributorLinkPayment, ProductPackage, Distributor} from '../core';
import { Op } from 'sequelize';
import { generateRandomCode } from '../../libs/random';

class MidDistributorLinkPayment {
    getLinkByCode(code) {
        return DistributorLinkPayment.findOne({
            where: {
                code
            },
            include: ['packageData']
        })
    }

    async CheckPayCreate(data){
        let Dispayment = await DistributorLinkPayment.findAll({
            where : {
                [Op.and]: [{ package_id: data.package_id }, { distributor_id: data.distributor_id }]
            }
        })
        
        if(Object.entries(Dispayment).length === 0){
            const dataInsert = {
                distributor_id : data.distributor_id,
                package_id: data.package_id,
                code: generateRandomCode()
            }
            await DistributorLinkPayment.create(dataInsert);
        }
    }

    async getLinkPayment(distributor_id) {
        let allLink = await DistributorLinkPayment.findAll({
            where: {
                distributor_id
            }
        });

        if (allLink.length) return allLink;

        let allPackage =  await ProductPackage.findAll();
        let dataInsert = allPackage.map(it => {
            return {
                package_id: it.id,
                distributor_id,
                code: generateRandomCode('LK-')
            }
        });

        return DistributorLinkPayment.bulkCreate(dataInsert);
    }
    
}

export default new MidDistributorLinkPayment();