import { DocumentTraining } from '../core';
import { ERROR_MESSAGE } from '../../config/error';

class MidDocumentTraining {
    UpdateDataUpload(title, NameFile, NameImage) {
        const dataInsert = {
            title: title,
            file: NameFile,
            image: NameImage
        }
        return DocumentTraining.create(dataInsert)
    }
    async getAllDocument(query) {


        let { page, limit } = query;
        page = page ? parseInt(page) : 1;
        limit = limit ? parseInt(limit) : 25;

        let listDocument = await DocumentTraining.findAll({
            where: {
                del: 0
            },
            order: [["id", "DESC"]],
            limit: limit,
            offset: (page - 1) * limit
        });

        let total = await DocumentTraining.count({
            where: {
                del: 0
            }
        })

        return { listDocument, total };
    }

    async updateDocument(data, NameFile, NameImage) {
        let document = await DocumentTraining.findOne({
            where: {
                id: data.id
            }
        });

        if (!document) {
            throw new Error(ERROR_MESSAGE.UPDATE_VIDEO_TRAINING.NOT_EXISTED)
        }

        let DataUpdate = {
            title: data.title
        }

        if (NameFile != '') {
            DataUpdate = {
                ...DataUpdate,
                file: NameFile
            }
        }

        if (NameImage != '') {
            DataUpdate = {
                ...DataUpdate,
                image: NameImage
            }
        }

        return document.update(DataUpdate);
    }

    async deleteDocument(id) {
        let document = await DocumentTraining.findOne({
            where: {
                id: id
            }
        });

        if (!document) {
            throw new Error(ERROR_MESSAGE.UPDATE_VIDEO_TRAINING.NOT_EXISTED)
        }

        return document.update({ del: 1 });
    }

    async getDocumentById(id) {
        return DocumentTraining.findOne({
            where: {
                id: id
            }
        })
    }
}

export default new MidDocumentTraining();