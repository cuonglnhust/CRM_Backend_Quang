import { DataTypes } from 'sequelize';
import { sequelize } from '../../connections';
import BaseModel from './BaseModel';

export default class DistributorNotify extends BaseModel {
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
    distributor_id: {
        type: DataTypes.INTEGER(10),
        allowNull: true,
        defaultValue: null
    },
    notify_id: {
        type: DataTypes.INTEGER(10),
        allowNull: true,
        defaultValue: null
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
    tableName: 'distributor_notify'
};

/**
 * Init Model
 */
DistributorNotify.init(attributes, { ...options, sequelize });