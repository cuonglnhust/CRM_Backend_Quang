import { UserDistributor, UserRole, RolePermission, Permissions, ConfirmForgot } from '../core';
import { Op } from 'sequelize';
import { checkPassword, hashPassword } from '../../libs/encrypt';
import { generateToken } from '../../libs/token';
import { ERROR_MESSAGE } from '../../config/error';
import { sendMailActiveOrder, sendMailForgotPassword } from '../../libs/sendmail';
import { v4 as uuidv4 } from 'uuid';
import { password } from '../../config/database';

class MidUser {
    getUserByEmail(email) {
        return UserDistributor.findOne({
            where: {
                email,
                del: 0
            }
        })
    }

    getUserById(userid) {
        return UserDistributor.findOne({
            where: {
                id: userid
            }
        })
    }

    async loginUser(credentials) {
        const { email, password } = credentials;
        if (!email) {
            throw new Error(ERROR_MESSAGE.LOGIN.ERR_REQUIRE_EMAIL);
        }

        if (!password) {
            throw new Error(ERROR_MESSAGE.LOGIN.ERR_REQUIRE_PASSWORD);
        }

        const userData = await this.getUserByEmail(email);
        if (!userData) {
            throw new Error(ERROR_MESSAGE.LOGIN.ERR_ACC);
        }

        const isCorrectPass = await checkPassword(password, userData.password);
        if (!isCorrectPass) {
            throw new Error(ERROR_MESSAGE.LOGIN.ERR_PASS);
        }

        // check account status is Active
        if (userData.status !== 1) {
            throw new Error(ERROR_MESSAGE.LOGIN.ERR_STATUS);
        }

        const token = await generateToken({ userid: userData.id, email: email });
        return {
            token
        }
    }

    async forgotPassword(data) {
        let { email, hostFront } = data;

        let oldForgot = await ConfirmForgot.findOne({
            where:{
                email
            }
        })

        if (oldForgot){
            await oldForgot.destroy();
        }

        let objForgot = await this.getUserByEmail(email);

        if (!objForgot) {
            throw new Error(ERROR_MESSAGE.FORGOT_PASSWORD.EMAIL_NOT_EXIST);
        }

        let stringConfirm = uuidv4();

        let objConfirm = {
            email,
            stringConfirm,
            countRequest: 0
        }

        await ConfirmForgot.create(objConfirm);

        let hostVerify = hostFront + `/auth/confirmForgot/${email}/${stringConfirm}`;

        await sendMailForgotPassword({ 
            name: objForgot.name,
            email: email,
            name: objForgot.name,
            hostVerify,
            hostWeb: hostFront
        })
    }

    async VerifyForgotPassword(email, strConfirm, newPassword) {
        let result = await ConfirmForgot.findOne({
            where: {
                email,
                stringConfirm: strConfirm
            }
        })

        if (!result) return 0;

        let now = new Date();
        let reqCreated = new Date(result.createAt);
        reqCreated.setDate(reqCreated.getDate() + 1);

        if(reqCreated > now){
            await result.destroy();
            return 2;
        }

        let userUpdate = await UserDistributor.findOne({
            where: {
                email,
                del: 0
            }
        })

        if (!userUpdate) return 3;

        await userUpdate.update({ password: hashPassword(newPassword) })

        await result.destroy();

        return 1;
    }

async updatePassword(oldPassword, password, userData) {
    const isCorrectPass = await checkPassword(oldPassword, userData.password);
    if (!isCorrectPass) {
        throw new Error(ERROR_MESSAGE.UPDATE_PASSWORD.ERR_OLD_PASS);
    }

    const encryptedPassword = await hashPassword(password);
    return userData.update({
        password: encryptedPassword
    });
}

async updateProfile(data, userData, avatar) {
    if (avatar) {
        data.avatar = avatar
    }

    return userData.update(data);
}
async loginUserSwitch(credentials, userDataAdmin) {
    const { email, password } = credentials;
    if (!email) {
        throw new Error(ERROR_MESSAGE.LOGIN.ERR_REQUIRE_EMAIL);
    }

    if (!password) {
        throw new Error(ERROR_MESSAGE.LOGIN.ERR_REQUIRE_PASSWORD);
    }

    const userData = await this.getUserByEmail(email);
    if (!userData) {
        throw new Error(ERROR_MESSAGE.LOGIN.ERR_ACC);
    }

    const isCorrectPass = await checkPassword(password, userDataAdmin.password);
    if (!isCorrectPass) {
        throw new Error(ERROR_MESSAGE.LOGIN.ERR_PASS);
    }

    // check account status is Active
    if (userData.status !== 1) {
        throw new Error(ERROR_MESSAGE.LOGIN.ERR_STATUS);
    }

    const token = await generateToken({ userid: userData.id, email: email });
    return {
        token
    }
}

async getAllPermission(){
    let listPermis = await Permissions.findAll({
        where: {
            del: 0
        },
        attributes: ["name", "key", "type"]
    })

    return { rows: listPermis };
}

async getPermissionByUserId(user_id){

    let user_role = await UserRole.findOne({
        where: {
            userid: user_id
        }
    });

    let role_permission = await RolePermission.findAll({
        where: {
            role_id: user_role.role_id
        }
    });

    let listPermission = [];

    for (let i = 0; i < role_permission.length; i++) {
        let permiss_id = role_permission[i].permission_id;
        let obj = await Permissions.findOne({
            where: {
                id: permiss_id,
                del: 0
            },
            attributes: ["name", "key", "type"]
        });

        listPermission.push(obj);
    }

    return { rows: listPermission };
}
}

export default new MidUser()