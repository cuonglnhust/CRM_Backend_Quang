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
export default class DistributorCreditHistory extends BaseModel {

    static association() {
      
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
    distributor_id:{
        type: DataTypes.INTEGER(10),
        allowNull: true,
        defaultValue: null
    },
    user_pay:{
        type: DataTypes.INTEGER(10),
        allowNull: true,
        defaultValue: null
    },
    type_pay:{
        type: DataTypes.TINYINT(1), // 1 : add, -1: pay
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
    tableName: 'distributor_credit_history'
};

/**
 * Init Model
 */
DistributorCreditHistory.init(attributes, { ...options, sequelize });