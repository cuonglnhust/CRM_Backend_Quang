import { MidNotification } from '../models/middle';
class NotificationController {
    CreateNotification(req, res) {
        let dataPost = req.body;
        return MidNotification.createNewNotifi(dataPost);
    }

    GetNotificationforDistributor(req, res) {
        let { userData } = req;
        let level = userData.level;
        let distributor_id = userData.distributor_id;
        return MidNotification.GetNewNotifiDistributor(level, distributor_id);
    }

    GetAllNotifyDistri(req, res) {
        let { userData } = req;
        let level = userData.level;
        let distributor_id = userData.distributor_id;
        return MidNotification.GetAllNotiDistri(level, distributor_id);
    }
    
    GetallNotify(req, res) {
        let dataQuery = req.query;
        return MidNotification.searchNotify(dataQuery);
    }

    updateNotify(req, res) {
        let dataPost = req.body;
        return MidNotification.updateNotify(dataPost);
    }

    DeleteNotify(req, res) {
        let { id } = req.query;
        return MidNotification.deleteNotify(id);
    }

    GetNotifyByid(req, res) {
        let { id } = req.query;
        return MidNotification.getNotityById(id);
    }

    CreateDistriNotify(req, res) {
        let { userData } = req;
        let distributor_id = userData.distributor_id;
        let { notify_id } = req.query;

        return MidNotification.CreateDistributorNotity(distributor_id, notify_id);
    }
    GetNotifyDetailDis(req, res) {
        let { userData } = req;
        let distributor_id = userData.distributor_id;
        return MidNotification.GetNotifyDetailDistri(distributor_id);
    }
    SearchNotifyDetailDis(req, res) {
        let { userData } = req;
        let distributor_id = userData.distributor_id;
        let data = req.query;
        return MidNotification.searchNotifyDetail(distributor_id,data);
    }
    CheckReadNotifyDetailDis(req, res) {
        let dataPost = req.body;
        let id_notify = dataPost.notify_id
        return MidNotification.CheckReadNotify(id_notify);
    }
}
export default new NotificationController();