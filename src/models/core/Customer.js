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
    del: {
        type: DataTypes.TINYINT(10),
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
    tableName: 'customer'
};

/**
 * Init Model
 */
Customer.init(attributes, { ...options, sequelize });