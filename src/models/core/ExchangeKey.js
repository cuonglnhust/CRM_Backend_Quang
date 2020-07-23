import { DataTypes } from 'sequelize';
import { sequelize } from '../../connections';
import BaseModel from './BaseModel';
// import ExchangeKeyDetail from './ExchangeKeyDetail';
import { Distributor } from '.';
import { setArr, parseArr } from '../../libs/db_parse';

export default class ExchangeKey extends BaseModel {
    static association() {
        ExchangeKey.belongsTo(Distributor, { as: 'distributor', foreignKey: 'distributor_id' });
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
        type: DataTypes.TINYINT(10),
        allowNull: true,
        defaultValue: null
    },
    parent_id: {
        type: DataTypes.TINYINT(10),
        allowNull: true,
        defaultValue: null
    },
    package_exchange: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
        get: function () {
            return parseArr(this.getDataValue('package_exchange'))
        },
        set: function (val) {
            this.setDataValue('package_exchange', setArr(val));
        }
    },
    package_receive: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
        get: function () {
            return parseArr(this.getDataValue('package_receive'))
        },
        set: function (val) {
            this.setDataValue('package_receive', setArr(val));
        }
    },
    del: {
        type: DataTypes.TINYINT(1),
        allowNull: true,
        default: 0
    },
    status: {
        type: DataTypes.TINYINT(1),
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
    tableName: 'exchange_key'
};

/**
 * Init Model
 */
ExchangeKey.init(attributes, { ...options, sequelize });