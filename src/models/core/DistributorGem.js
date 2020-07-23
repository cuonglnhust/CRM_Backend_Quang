import { DataTypes } from 'sequelize';
import { sequelize } from '../../connections';
import BaseModel from './BaseModel';

/**
 * Define DistributorGem Model
 * thong tin anh QR Gem cua dai ly (GEM la 1 cong thanh toan bang dong tien ao)
 * 
 * @export
 * @class DistributorGem
 * @extends {BaseModel}
 */
export default class DistributorGem extends BaseModel {

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
    distributor_id: {
        type: DataTypes.INTEGER(10),
        allowNull: true,
        defaultValue: null
    },
    gem_qr: {
        type: DataTypes.STRING(255),
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
    tableName: 'distributor_gem'
};

/**
 * Init Model
 */
DistributorGem.init(attributes, { ...options, sequelize });