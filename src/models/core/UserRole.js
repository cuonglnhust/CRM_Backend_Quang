
import { DataTypes } from 'sequelize';
import { sequelize } from '../../connections';
import BaseModel from './BaseModel';

/**
 * Define UserRole Model
 * luu nhom quyen cua user
 * 
 * @export
 * @class UserRole
 * @extends {BaseModel}
 */
export default class UserRole extends BaseModel {

    static association() {
        // Roles.hasMany(Users, {as: 'users', foreignKey: 'role_id', hooks: true, onDelete: 'CASCADE', onUpdate : 'NO ACTION'});
        // Roles.belongsToMany(Permissions, {
        //     through: "role_permission",
        //     as: "permissions",
        //     foreignKey: "role_id"
        // });
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
    userid: {
        type: DataTypes.INTEGER(10),
        allowNull: true,
        defaultValue: 0
    },
    role_id: {
        type: DataTypes.INTEGER(10),
        allowNull: true,
        defaultValue: 0
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
    tableName: 'user_role'
};

/**
 * Init Model
 */
UserRole.init(attributes, { ...options, sequelize });