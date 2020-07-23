import { DataTypes } from 'sequelize';
import { sequelize } from '../../connections';
import BaseModel from './BaseModel';
import { Users } from '.';
import { Op } from 'sequelize';
/**
 * Define User Model
 * 
 * @export
 * @class User
 * @extends {BaseModel}
 */
export default class RolePermission extends BaseModel {

    static association() {
      // RolePermission.hasMany(Users, {as: 'users', foreignKey: 'role_id', hooks: true, onDelete: 'CASCADE', onUpdate : 'NO ACTION'});
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
    role_id:{
      type: DataTypes.INTEGER(10),
      allowNull: true,
      defaultValue: null
    },
    permission_id:{
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
    tableName: 'role_permission'
};

/**
 * Init Model
 */
RolePermission.init(attributes, { ...options, sequelize });