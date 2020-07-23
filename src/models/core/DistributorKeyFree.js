import { DataTypes } from 'sequelize';
import { sequelize } from '../../connections';
import BaseModel from './BaseModel';

/**
 * Define DistributorKeyFree Model
 * luu config so luong key trial ma dai ly nhan duoc khi dang ky thanh cong
 * 
 * @export
 * @class DistributorKeyFree
 * @extends {BaseModel}
 */
export default class DistributorKeyFree extends BaseModel {

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
        type: DataTypes.TINYINT(1),
        allowNull: true,
        defaultValue: null
    },
    package_id: {
        type: DataTypes.INTEGER(10),
        allowNull: true,
        defaultValue: null
    },
    quantity: {
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
    tableName: 'distributor_key_free'
};

/**
 * Init Model
 */
DistributorKeyFree.init(attributes, { ...options, sequelize });