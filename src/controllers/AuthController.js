import { MidUser } from '../models/middle';
import { Console } from 'winston/lib/winston/transports';

class AuthController {
    login(req, res) {
        return MidUser.loginUser(req.body);
    }

    loginswitch(req, res) {
        const { userData } = req;
        return MidUser.loginUserSwitch(req.body, userData);
    }

    forgotPassword(req, res) {
        return MidUser.forgotPassword(req.body);
    }

    verifyForgot(req, res){
        const {email, strConfirm, newPassword} = req.body;
        return MidUser.VerifyForgotPassword(email, strConfirm, newPassword)
    }
}

export default new AuthController();