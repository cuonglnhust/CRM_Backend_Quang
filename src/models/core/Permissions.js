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
export default class Permissions extends BaseModel {

    static association() {
    }

    static checkTypeUnique(type) {
        return this.findOne({
            where: {
                type,
              del: 0,
            }
        });
    }

    static checkNameUnique(name) {
        return this.findOne({
            where: {
                name,
                del: 0,
            }
        });
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
    key: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null
    },
    type: {
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
    tableName: 'permissions'
};

/**
 * Init Model
 */
Permissions.init(attributes, { ...options, sequelize });