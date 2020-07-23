import { DataTypes } from 'sequelize';
import { sequelize } from '../../connections';
import BaseModel from './BaseModel';

/**
 * Define DistributerKey Model
 * Luu danh sach key ma dai ly mua
 * 
 * @export
 * @class DistributerKey
 * @extends {BaseModel}
 */
export default class DistributerKey extends BaseModel {

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
        defaultValue: 0
    },
    key_id: {
        type: DataTypes.INTEGER(10),
        allowNull: true,
        defaultValue: 0
    },
    license_key: {
        type: DataTypes.INTEGER(10),
        allowNull: true,
        defaultValue: 0
    },
    order_id: {
        type: DataTypes.INTEGER(10),
        allowNull: true,
        defaultValue: 0
    },
    package_id: {
        type: DataTypes.INTEGER(10),
        allowNull: true
    },
    is_sell: {
        type: DataTypes.TINYINT(1), // 1: da ban, 0: chua bán
        allowNull: true,
        default: 0
    },
    is_exchange: {
        type: DataTypes.TINYINT(1), // 1: da ban, 0: chua bán
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
    tableName: 'distributer_key'
};

/**
 * Init Model
 */
DistributerKey.init(attributes, { ...options, sequelize });