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
export default class DistributorDiscount extends BaseModel {

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
    level: {
        type: DataTypes.INTEGER(10),
        allowNull: true,
        defaultValue: null
    },
    discount: {
        type: DataTypes.INTEGER(10),
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
    tableName: 'distributor_discount'
};

/**
 * Init Model
 */
DistributorDiscount.init(attributes, { ...options, sequelize });