import { DataTypes } from 'sequelize';
import { sequelize } from '../../connections';
import BaseModel from './BaseModel';

/**
 * Define ProductPackage Model
 * danh sach cac package cua product
 * 
 * @export
 * @class ProductPackage
 * @extends {BaseModel}
 */
export default class ProductPackage extends BaseModel {

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
    product_id: {
        type: DataTypes.INTEGER(10),
        allowNull: true
    },
    price: {
        type: DataTypes.INTEGER(10),
        allowNull: true
    },
    is_trial: {
        type: DataTypes.TINYINT(1),
        allowNull: true,
        default: 0
    },
    del: {
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
    tableName: 'product_package'
};

/**
 * Init Model
 */
ProductPackage.init(attributes, { ...options, sequelize });