import { DataTypes } from 'sequelize';
import { sequelize } from '../../connections';
import BaseModel from './BaseModel';
import { ExchangeKey } from '.';

export default class ExchangeKeyDetail extends BaseModel {
    static association() {
        ExchangeKeyDetail.belongsTo(ExchangeKey, { as: 'exchange_key', foreignKey: 'exchange_id' });
    }
}
const attributes = {
    id: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    exchange_id: {
        type: DataTypes.TINYINT(1),
        allowNull: true,
        defaultValue: null
    },
    package_id: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null
    },
    amount_exchange: {
        type: DataTypes.INTEGER(10),
        allowNull: true,
        default: 0
    },
    amount_received: {
        type: DataTypes.INTEGER(10),
        allowNull: true,
        default: 0
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
    tableName: 'exchange_key_detail'
};

/**
 * Init Model
 */
ExchangeKeyDetail.init(attributes, { ...options, sequelize });