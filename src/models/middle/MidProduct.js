import { Product, ProductPackage, ProductKey } from '../core';
class MidProduct{
    getListProduct() {
        return Product.findOne();
    }

    getPackageOfProduct(product_id) {
        return ProductPackage.findAll({
            where: {
                product_id
            }
        })
    }

    getProductKeyOfDistributor(dataSearch) {
        return ProductKey.findAll({
            where: dataSearch
        })
    }

    getPackageById(package_id) {
        return ProductPackage.findOne({
            where: {
                id: package_id
            }
        })
    }

}

export default new MidProduct();