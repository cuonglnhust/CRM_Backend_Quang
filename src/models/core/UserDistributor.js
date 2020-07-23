import { DataTypes } from 'sequelize';
import { sequelize } from '../../connections';
import BaseModel from './BaseModel';
import { UserRole } from '../core'; 

/**
 * Define UserDistributor Model
 * Thong tin tai khoan quan tri cua dai ly, dung tai quan nay de dang nhap he thong
 * 
 * @export
 * @class UserDistributor
 * @extends {BaseModel}
 */
export default class UserDistributor extends BaseModel {

    static association() {
        UserDistributor.hasOne(UserRole, {as: 'role', foreignKey: 'userid', hooks: true, onDelete: 'CASCADE', onUpdate : 'NO ACTION'});
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
    distributor_id: {
        type: DataTypes.INTEGER(10),
        allowNull: true,
        defaultValue: null
    },
    password: {
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
    address: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    city: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    status: {
        type: DataTypes.TINYINT(1), // 0 - No active, 1 - Active, 2 - Block
        allowNull: true,
        defaultValue: 0
    },
    type: {
        type: DataTypes.TINYINT(1), // 1 - Super Admin, 2 - Distributor
        allowNull: true,
        default: 2
    },
    level: {
        type: DataTypes.TINYINT(1), // 0 - Admin, 1 - Cấp 1, 2 - Cấp 2, 3 - Cấp 3
        allowNull: true,
        default: 2
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
    tableName: 'user_distributor'
};

/**
 * Init Model
 */
UserDistributor.init(attributes, { ...options, sequelize });