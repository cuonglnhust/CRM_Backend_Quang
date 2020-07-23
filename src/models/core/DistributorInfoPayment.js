import { DataTypes } from 'sequelize';
import { sequelize } from '../../connections';
import BaseModel from './BaseModel';

/**
 * Define DistributorInfoPayment Model
 * thong tin tai khoan ngan hang cua dai ly
 * 
 * @export
 * @class DistributorInfoPayment
 * @extends {BaseModel}
 */
export default class DistributorInfoPayment extends BaseModel {

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
    bank_name: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null
    },
    bank_no: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null
    },
    branch: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null
    },
    owner: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null
    },
    distributor_id: {
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
    tableName: 'distributor_info_payment'
};

/**
 * Init Model
 */
DistributorInfoPayment.init(attributes, { ...options, sequelize });