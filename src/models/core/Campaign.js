import { DataTypes } from 'sequelize';
import { sequelize } from '../../connections';
import BaseModel from './BaseModel';

/**
 * Define Customer Model
 * tạo chiến dịch 
 * @export
 * @class Customer
 * @extends {BaseModel}
 */
export default class Campaign extends BaseModel {

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
    number: {
        type: DataTypes.INTEGER(10),
        allowNull: true,
        defaultValue: null
    },
    mobile: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null
    },
    unit: {
        type: DataTypes.TINYINT(10),
        allowNull: true,
        default: 1
    },
    maxNumber: {
        type: DataTypes.INTEGER(10),
        allowNull: true,
        default: 1
    },
    package_id: {
        type: DataTypes.INTEGER(10),
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
    tableName: 'campaign'
};

/**
 * Init Model
 */
Campaign.init(attributes, { ...options, sequelize });