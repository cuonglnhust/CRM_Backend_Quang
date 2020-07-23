import path from 'path';
import multer from 'multer';

export const uploadMedia = (req, res) => {
    return new Promise((resolve, reject) => {
        let storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, path.join(__dirname, '../../media'));
            },
            filename: function (req, file, cb) {
                cb(null, Date.now() + '_' + file.originalname);
            }
        });

        let upload = multer({
            storage: storage
        }).single('file');

        upload(req, res, function (error) {
            if (error) {
                return reject(error)
            }

            let fileData = req.file;
            return resolve(fileData)
        });
    });
}

export const uploadMultiMedia = (req, res) => {
    return new Promise((resolve, reject) => {
        let storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, path.join(__dirname, '../../media'));
            },
            filename: function (req, file, cb) {
                cb(null, Date.now() + '_' + file.originalname);
            }
        });

        let upload = multer({
            storage: storage
        }).array('file',2);

        upload(req, res, function (error) {
            if (error) {
                return reject(error)
            }

            let fileData = req.files;
            return resolve(fileData)
        });
    });
}