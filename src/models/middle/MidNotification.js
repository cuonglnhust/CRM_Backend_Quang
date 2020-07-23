import { Notification, DistributorNotify,NotifyDetail } from '../core';
import { Op } from 'sequelize';
import { ERROR_MESSAGE } from '../../config/error';
class MidNotification {
    createNewNotifi(data) {

        data.level = parseInt(data.level);

        if (data.level == null || !data.title || !data.content || data.is_show == null) {
            throw new Error(ERROR_MESSAGE.CREATE_ORDER_RETAIL.ERR_REQUIRE);
        }
        data.del = 0;
        return Notification.create(data);
    }

    async CheckNotity(distributor_id, notify_id) {
        let disnoti = await DistributorNotify.findOne({
            where: {
                distributor_id: distributor_id,
                notify_id: notify_id
            }
        });
        return disnoti;
    }

    async GetNewNotifiDistributor(level, distributor_id) {
        var datenow = new Date();
        //let datenowFormat  = datenow.getFullYear() + "-" + appendLeadingZeroes(datenow.getMonth() + 1) + "-" + appendLeadingZeroes(datenow.getDate() -1);
        if (!level) {
            throw new Error(ERROR_MESSAGE.CREATE_ORDER_RETAIL.ERR_REQUIRE);
        }
        let result = []
            //let checkNotify = await 
        var notifi = await Notification.findAll({
            where: {
                level: {
                    [Op.or]: [{
                            [Op.eq]: parseInt(level)
                        },
                        {
                            [Op.eq]: 0
                        }
                    ]
                },
                endDate: {
                    [Op.gte]: datenow
                },
                startDate: {
                    [Op.lte]: datenow
                },
                del: 0,
                is_show: 1
            }
        });

        for (let i = 0; i < notifi.length; i++) {
            var resNotify = await this.CheckNotity(distributor_id, notifi[i].id);
            if (!resNotify) {
                result.push(notifi[i]);
            }
        }
        return { result }
    }

    async GetAllNotiDistri(level, distributor_id) {
        var datenow = new Date();
        let countUnRead = 0;
        //let datenowFormat  = datenow.getFullYear() + "-" + appendLeadingZeroes(datenow.getMonth() + 1) + "-" + appendLeadingZeroes(datenow.getDate() -1);
        if (!level) {
            throw new Error(ERROR_MESSAGE.CREATE_ORDER_RETAIL.ERR_REQUIRE);
        }
        //let checkNotify = await 
        var notifi = await Notification.findAll({
            where: {
                level: {
                    [Op.or]: [{
                            [Op.eq]: parseInt(level)
                        },
                        {
                            [Op.eq]: 0
                        }
                    ]
                },
                endDate: {
                    [Op.gte]: datenow
                },
                startDate: {
                    [Op.lte]: datenow
                },
                del: 0
            },
            order: [
                ["createdAt", "DESC"]
            ],
            limit: 10
        });

        let result = [];

        for (let i = 0; i < notifi.length; i++) {
            var resNotify = await this.CheckNotity(distributor_id, notifi[i].id);

            let objNotify = {};

            if (resNotify) {
                objNotify = notifi[i].toJSON();
                objNotify.isRead = true;

            } else {
                objNotify = notifi[i].toJSON();
                objNotify.isRead = false;
                countUnRead++;
            }

            result.push(objNotify);
        }

        return { result, countUnRead }
    }

    async searchNotify(data) {

        let condition = {
            del: 0
        };

        if (data.startDate) {
            condition = {
                ...condition,
                startDate: {
                    [Op.gte]: data.startDate
                }
            }
        }

        if (data.startDate) {
            condition = {
                ...condition,
                endDate: {
                    [Op.lte]: data.endDate
                }
            }
        }

        if (data.title) {
            condition.title = {
                [Op.like]: `%${data.title}%`
            }
        }

        if (data.level && parseInt(data.level)) {
            condition.level = parseInt(data.level);
        }

        if (data.is_show && parseInt(data.is_show)) {
            condition.is_show = parseInt(data.is_show);
        }

        let { page, limit } = data;
        page = page ? parseInt(page) : 1;
        limit = limit ? parseInt(limit) : 25;

        const [alllDistributor, total] = await Promise.all([
            Notification.findAll({
                where: condition,
                order: [
                    ["id", "DESC"]
                ],
                limit,
                offset: (page - 1) * limit
            }),
            Notification.count({
                where: condition
            })
        ])

        return {
            rows: alllDistributor,
            total: total || 0
        }
    }

    async updateNotify(data) {
        if (!data.title || !data.content || !data.startDate || data.level == '' || !data.endDate) {
            throw new Error('Yêu cầu nhập đầy đủ thông tin');
        }

        data.level = parseInt(data.level);

        let notify = await this.getNotityById(data.id);
        if (!notify) {
            throw new Error('không tìm thấy thông báo!')
        }
        const dataUpdate = {
            id: data.id,
            title: data.title,
            content: data.content,
            is_show: data.is_show,
            startDate: data.startDate,
            endDate: data.endDate,
            level: data.level
        };

        return notify.update(dataUpdate);
    }

    async deleteNotify(notify_id) {

        let notify = await this.getNotityById(notify_id);
        if (!notify) {
            throw new Error('không tìm thấy thông báo!')
        }

        return notify.update({ del: 1 });
    }
    async CheckReadNotify(notify_id) {

        let notify = await this.getNotityDetailById(notify_id);
        if (!notify) {
            throw new Error('không tìm thấy thông báo!')
        }

        return notify.update({ status: 1 });
    }

    async getNotityById(id) {
        return await Notification.findOne({
            where: {
                id: id,
                del: 0
            }
        })
    }
    async getNotityDetailById(id) {
        return await NotifyDetail.findOne({
            where: {
                id: id,
                del: 0
            }
        })
    }
    async CreateDistributorNotity(distributor_id, notify_id) {
        const dataInsert = {
            distributor_id: distributor_id,
            notify_id: notify_id
        }
        return DistributorNotify.create(dataInsert);
    }

    async GetNotifyDetailDistri(distributor_id) {

        let condition = {
            del: 0,
            distributor_id : distributor_id
            
        };
        const [alllDistributor, total] = await Promise.all([
            NotifyDetail.findAll({
                where: condition,
                order: [["createdAt", "DESC"]],
                limit: 10
            }),
            NotifyDetail.count({
                where: condition
            })
        ])
        return {
            rows: alllDistributor,
            total: total || 0
        }
    }

    async searchNotifyDetail(distributor_id,data) {

        let condition = {
            del: 0,
            distributor_id : distributor_id
        };

        if (data.content) {
            condition.content = {
                [Op.like]: `%${data.content}%`
            }
        }
        if (data.status && parseInt(data.status)) {
            condition.status = parseInt(data.status);
        }

        let { page, limit } = data;
        page = page ? parseInt(page) : 1;
        limit = limit ? parseInt(limit) : 25;

        const [alllDistributor, total] = await Promise.all([
            NotifyDetail.findAll({
                where: condition,
                order: [["id", "DESC"]],
                limit,
                offset: (page - 1) * limit
            }),
            NotifyDetail.count({
                where: condition
            })
        ])

        return {
            rows: alllDistributor,
            total: total || 0
        }
    }


}
export default new MidNotification();