import { DataTypes } from 'sequelize';
import { sequelize } from '../../connections';
import BaseModel from './BaseModel';
import { Users } from '.';
import { Op } from 'sequelize';
import { setArr, parseArr } from '../../libs/db_parse';
/**
 * Define User Model
 * 
 * @export
 * @class User
 * @extends {BaseModel}
 */
export default class DistributorPermission extends BaseModel {

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
    type:{
      type: DataTypes.TINYINT(1), // 1 - System, 2 - Dai Ly
      allowNull: true,
      defaultValue: null
    },
    permission_id:{
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
        get: function () {
            return parseArr(this.getDataValue('permission_id'))
        },
        set: function (val) {
            this.setDataValue('permission_id', setArr(val));
        }
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
    tableName: 'distributor_permission'
};

/**
 * Init Model
 */
DistributorPermission.init(attributes, { ...options, sequelize });