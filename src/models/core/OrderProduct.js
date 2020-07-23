import { DataTypes } from 'sequelize';
import { sequelize } from '../../connections';
import BaseModel from './BaseModel';
import { Order } from './';
/**
 * Define OrderProduct Model
 * store list product of order
 * 
 * @export
 * @class OrderProduct
 * @extends {BaseModel}
 */
export default class OrderProduct extends BaseModel {

    static association() {
        OrderProduct.belongsTo(Order, { as: 'order', foreignKey: 'order_id' })
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
    order_id: {
        type: DataTypes.INTEGER(10),
        allowNull: true,
        defaultValue: null
    },
    product_id: {
        type: DataTypes.INTEGER(10),
        allowNull: true,
        defaultValue: null
    },
    package_id: {
        type: DataTypes.INTEGER(10),
        allowNull: true,
        defaultValue: null
    },
    total_price: {
        type: DataTypes.INTEGER(10),
        allowNull: true,
        defaultValue: null
    },
    price: {
        type: DataTypes.INTEGER(10),
        allowNull: true,
        defaultValue: null
    },
    quantity: {
        type: DataTypes.INTEGER(10),
        allowNull: true,
        defaultValue: null
    },
    discount: {
        type: DataTypes.FLOAT,
        allowNull: true
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
    tableName: 'order_product'
};

/**
 * Init Model
 */
OrderProduct.init(attributes, { ...options, sequelize });