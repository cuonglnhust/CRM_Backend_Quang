import { DataTypes } from 'sequelize';
import { sequelize } from '../../connections';
import BaseModel from './BaseModel';

/**
 * Define VideoTraining Model
 * Luu danh sách video huấn luyện
 * 
 * @export
 * @class VideoTraining
 * @extends {BaseModel}
 */
export default class VideoTraining extends BaseModel {

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
    link: {
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
    tableName: 'video_training'
};

VideoTraining.init(attributes, { ...options, sequelize });