import { VideoTraining } from '../core';
import { ERROR_MESSAGE } from '../../config/error';

class MidTraining {
    GetVideoById(id) {
        return VideoTraining.findOne({
            where: id
        })
    }

    async getAllVideo(query) {
        let {page, limit} = query;

        let pageQuery = parseInt(page);

        let limitQuery = parseInt(limit);

        let listVideo = await VideoTraining.findAll({
            where: {
                del: 0
            },
            order: [["id", "DESC"]],
            limit: limitQuery,
            offset: (pageQuery - 1) * limit
        });

        let total = await VideoTraining.count({
            where: {
                del: 0
            }
        })

        return {listVideo, total};
    }

    async getVideoById(id) {
        return VideoTraining.findOne({
            where: {
                id: id
            }
        })
    }

    async updateVideo(data){
        let video = await VideoTraining.findOne({
            where: {
                id: data.id
            }
        });

        if (!video) {
            throw new Error(ERROR_MESSAGE.UPDATE_VIDEO_TRAINING.NOT_EXISTED)
        }

        return video.update(data);
    }

    async deleteVideo(id){
        let video = await VideoTraining.findOne({
            where: {
                id: id
            }
        });

        if (!video) {
            throw new Error(ERROR_MESSAGE.UPDATE_VIDEO_TRAINING.NOT_EXISTED)
        }

        return video.update({del: 1});
    }

    createVideo(data){
        return VideoTraining.create(data);
    }
}

export default new MidTraining();