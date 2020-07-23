import { DataTypes } from 'sequelize';
import { sequelize } from '../../connections';
import BaseModel from './BaseModel';

/**
 * Define User Model
 * 
 * @export
 * @class User
 * @extends {BaseModel}
 */
export default class Product extends BaseModel {

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
    image: {
        type: DataTypes.STRING(255),
        allowNull: true
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
    tableName: 'product'
};

/**
 * Init Model
 */
Product.init(attributes, { ...options, sequelize });