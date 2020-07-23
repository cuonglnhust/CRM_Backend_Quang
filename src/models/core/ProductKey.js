import { DataTypes } from 'sequelize';
import { sequelize } from '../../connections';
import BaseModel from './BaseModel';
import { ProductPackage } from './';
/**
 * Define ProductKey Model
 * Thong tin key
 * 
 * @export
 * @class ProductKey
 * @extends {BaseModel}
 */
export default class ProductKey extends BaseModel {

    static association() {
        ProductKey.belongsTo(ProductPackage, { as: 'productpackage', foreignKey: 'package_id' })
    }
}

/**
 * Attributes model
 */
const attributes = {
    id: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    license_key: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: 0
    },
    order_id: {
        type: DataTypes.INTEGER(10),
        allowNull: true,
        defaultValue: 0
    },
    product_id: {
        type: DataTypes.INTEGER(10),
        allowNull: true,
        defaultValue: null
    },
    package_id: {
        type: DataTypes.INTEGER(10),
        allowNull: true
    },
    type_key: {
        type: DataTypes.TINYINT(1), // type = 1: key mua, type = 2: key duoc tang free 1 thang
        allowNull: true,
        default: 1
    },
    is_sell: {
        type: DataTypes.TINYINT(1), // 1: da ban, 0: chua bán
        allowNull: true,
        default: 0
    },
    is_exchange: {
        type: DataTypes.TINYINT(1),
        allowNull: true,
        default: 0
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: true
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: true
    }
};

/**
 * Options model
 */
const options = {
    tableName: 'product_key'
};

/**
 * Init Model
 */
ProductKey.init(attributes, { ...options, sequelize });