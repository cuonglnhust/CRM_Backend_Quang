import { DataTypes } from 'sequelize';
import { sequelize } from '../../connections';
import BaseModel from './BaseModel';

/**
 * Define DocumentTraining Model
 * Luu danh sách tài liệu
 * 
 * 
 * @export
 * @class DocumentTraining
 * @extends {BaseModel}
 */
export default class DocumentTraining extends BaseModel {

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
    title: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null
    },
    file: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null
    },
    image: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null
    },
    del: {
        type: DataTypes.TINYINT(1),
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
    tableName: 'document_training'
};

DocumentTraining.init(attributes, { ...options, sequelize });