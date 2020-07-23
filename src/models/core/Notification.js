import { DataTypes } from 'sequelize';
import { sequelize } from '../../connections';
import BaseModel from './BaseModel';

export default class Notification extends BaseModel {
    static association() {
      
    }
}
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
    title: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null
    },
    is_show: {
        type: DataTypes.TINYINT(1),
        allowNull: true,
        defaultValue: null
    },
    del: {
        type: DataTypes.TINYINT(10),
        allowNull: true,
        default: 0
    },
    startDate: {
        type: DataTypes.DATE,
        allowNull: true
    },
    endDate: {
        type: DataTypes.DATE,
        allowNull: true
    },
    createdBy: {
        type: DataTypes.INTEGER(10),
        allowNull: true,
        defaultValue: null
    },
    updatedBy: {
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
    tableName: 'notification'
};

/**
 * Init Model
 */
Notification.init(attributes, { ...options, sequelize });