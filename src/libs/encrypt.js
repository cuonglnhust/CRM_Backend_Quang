import bcrypt from 'bcryptjs';

export const hashPassword = (password) => {
    if (!password) return '';
    return bcrypt.hashSync(password, 10);
}

export const checkPassword = async(password, hashPass) => {
    if (!hashPass) {
        return false;
    }
    return bcrypt.compareSync(password, hashPass);
}