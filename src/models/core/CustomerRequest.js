import { DataTypes } from 'sequelize';
import { sequelize } from '../../connections';
import BaseModel from './BaseModel';

/**
 * Define Customer Model
 * 
 * @export
 * @class Customer
 * @extends {BaseModel}
 */
export default class Customer extends BaseModel {

    static association() {
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
    distributor_id: {
        type: DataTypes.INTEGER(10),
        allowNull: true,
        defaultValue: null
    },
    customer_id: {
        type: DataTypes.INTEGER(10),
        allowNull: true,
        defaultValue: null
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null
    },
    mobile: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null
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
    tableName: 'customer'
};

/**
 * Init Model
 */
Customer.init(attributes, { ...options, sequelize });