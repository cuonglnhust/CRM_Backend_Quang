import { DataTypes } from 'sequelize';
import { sequelize } from '../../connections';
import BaseModel from './BaseModel';

/**
 * Define Order Model
 * 
 * @export
 * @class Order
 * @extends {BaseModel}
 */
export default class NotifyDetail extends BaseModel {

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
    content: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null
    },
    type: {
        type: DataTypes.TINYINT(1), // kiểu của thông báo 1: NPP gửi yêu cầu đổi Key, 2: NPP tạo đơn hàng mua sỉ, 3:NPP tạo 1 NPP cấp dưới
        allowNull: true, //4: Admin / NPP cấp trên xác nhận / huỷ đơn hàng mua sỉ, 5: NPP cấp dưới tạo đơn hàng mua sỉ, 6: Có đơn hàng mới từ khách hàng, 7: Admin / NPP cấp trên xác nhận / huỷ yêu cầu đổi key
        defaultValue: null
    },
    status: {
        type: DataTypes.TINYINT(1), // 0: chưa xem, 1: đã xem
        allowNull: true,
        defaultValue: 0
    },
    distributor_id: {
        type: DataTypes.INTEGER(10), // id đại lý show thông báo
        allowNull: true,
        defaultValue: 0
    },
    detailInfo: {
        type: DataTypes.STRING(255), // chi tiết thông báo
        allowNull: true,
        defaultValue: null
    },
    del: {
        type: DataTypes.TINYINT(10),
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
    tableName: 'notify_detail'
};

/**
 * Init Model
 */
NotifyDetail.init(attributes, { ...options, sequelize });