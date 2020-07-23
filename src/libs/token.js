const jwt = require('jsonwebtoken');
import { secretJWT } from '../config/setting';
export const generateToken = async(data, secretKey = secretJWT, expiresIn = '30d') => {
    return jwt.sign(data, secretKey, { expiresIn });
}

export const generateTokenReset = async(data, secretKey = secretJWT, expiresIn = '7h') => {
    return jwt.sign(data, secretKey, { expiresIn });
}

export const checkToken = async(token, secretKey = secretJWT) => {
    return jwt.verify(token, secretKey);
}