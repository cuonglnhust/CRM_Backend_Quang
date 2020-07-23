import { DataTypes } from 'sequelize';
import { sequelize } from '../../connections';
import BaseModel from './BaseModel';
import { OrderProduct, Distributor, Customer, UserDistributor } from './';

/**
 * Define Order Model
 * 
 * @export
 * @class Order
 * @extends {BaseModel}
 */
export default class Order extends BaseModel {

    static association() {
        Order.hasMany(OrderProduct, {as: 'productData', foreignKey: 'order_id', hooks: true, onDelete: 'CASCADE', onUpdate : 'NO ACTION'});
        Order.belongsTo(Distributor, { as: 'distributor', foreignKey: 'distributor_id' })
        Order.belongsTo(Distributor, { as: 'distributorBuy', foreignKey: 'distributor_buy_id'})
        Order.belongsTo(Customer, { as: 'customer', foreignKey: 'userid' })
        Order.belongsTo(UserDistributor, { as: 'userAction', foreignKey: 'user_action' })
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
    code: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: null
    },
    userid: {
        type: DataTypes.INTEGER(10),
        allowNull: true,
        defaultValue: null
    },
    distributor_id: {
        type: DataTypes.INTEGER(10),
        allowNull: true,
        defaultValue: null
    },
    distributor_buy_id: {
        type: DataTypes.INTEGER(10),
        allowNull: true,
        defaultValue: null
    },
    total_price: {
        type: DataTypes.INTEGER(10),
        allowNull: true,
        defaultValue: null
    },
    origin_price: {
        type: DataTypes.INTEGER(10),
        allowNull: true,
        defaultValue: 0
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
    status: {
        type: DataTypes.TINYINT(1), // 0 - Pending, 1 - Success, 2 - Cancel
        allowNull: true
    },
    type: {
        type: DataTypes.TINYINT(1), // 0 - don hang le, 1 - don hang si
        allowNull: true,
        defaultValue: 0
    },
    note_pay: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: null
    },
    user_action: {
        type: DataTypes.INTEGER(10),
        allowNull: true,
        defaultValue: null
    },
    del: {
        type: DataTypes.TINYINT(1), // 1 - bi xoa
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
    tableName: 'order'
};

/**
 * Init Model
 */
Order.init(attributes, { ...options, sequelize });