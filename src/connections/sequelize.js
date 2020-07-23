import database from '../config/database'
import Sequelize from 'sequelize';

export default new Sequelize(database);