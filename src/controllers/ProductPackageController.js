import { MidProductPackage } from '../models/middle';
import { uploadMedia } from '../libs/upload';
import MidKey from '../models/middle/MidKey';
import XLSX from 'xlsx';

class ProductPackageController {

    async GetAllPackage(req, res) {

        return MidProductPackage.getAllPackage();
    }

    async GetAllPackageExchange(req, res) {

        return MidProductPackage.getAllPackageExchange();
    }

    async importKey(req, res) {
        const dataUpload = await uploadMedia(req, res);
        const { package_id } = req.body
        if (!package_id) {
            throw new Error('Require params')
        }

        let workbook = XLSX.readFile(dataUpload.path, {});
        let sheet_name_list = workbook.SheetNames;
        let out = [];
        let ws = workbook.Sheets[sheet_name_list[0]]
        let aoa = XLSX
            .utils
            .sheet_to_json(ws, { raw: true, header: 1 });

        let dataHeader = aoa[5];
        if (!dataHeader) {
            throw new Error('File không hợp lệ');
        }

        if (dataHeader.indexOf('Key') < 0) {
            throw new Error('File không hợp lệ');
        }

        aoa.slice(6).forEach(function(row) {
            var data = {
                license_key: row[1] || '',
                package_id,
                distributor_id: 0,
                is_sell: 0
            };

            if (data.license_key) {
                out.push(data);
            }
        });

        if (!out.length) {
            throw new Error('Notfound Key To Import');
        }

        return MidKey.createListRecord(out);
    }

}
export default new ProductPackageController();