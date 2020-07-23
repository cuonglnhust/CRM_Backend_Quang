import { DataTypes } from 'sequelize';
import { sequelize } from '../../connections';
import BaseModel from './BaseModel';

/**
 * Define Distributor Model
 * Thong tin dai ly
 * 
 * @export
 * @class Distributor
 * @extends {BaseModel}
 */
export default class Distributor extends BaseModel {

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
    code: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: null
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null
    },
    parent_id: {
        type: DataTypes.INTEGER(10),
        allowNull: true,
        defaultValue: 0
    },
    credit: {
        type: DataTypes.INTEGER(10),
        allowNull: true,
        defaultValue: 0
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
    avatar: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    active: {
        type: DataTypes.TINYINT(1),
        allowNull: true
    },
    level: {
        type: DataTypes.TINYINT(1),
        allowNull: true
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
    tableName: 'distributor'
};

/**
 * Init Model
 */
Distributor.init(attributes, { ...options, sequelize });