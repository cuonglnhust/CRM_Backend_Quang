import { DataTypes } from 'sequelize';
import { sequelize } from '../../connections';
import BaseModel from './BaseModel';
import { RolePermission } from './';
// import { Op } from 'sequelize';
/**
 * Define User Model
 * 
 * @export
 * @class User
 * @extends {BaseModel}
 */
export default class Roles extends BaseModel {

    static association() {
        Roles.hasMany(RolePermission, {as: 'permission', foreignKey: 'role_id', hooks: true, onDelete: 'CASCADE', onUpdate : 'NO ACTION'});
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
    name: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null
    },
    df_distributor: {
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
    tableName: 'roles'
};

/**
 * Init Model
 */
Roles.init(attributes, { ...options, sequelize });