import { Model } from 'sequelize';
/**
 * Wrapper class Model of sequelize
 * 
 * @export
 * @class BaseModel
 * @extends {Model}
 */
export default class BaseModel extends Model {

    /**
     * Creates an instance of BaseModel.
     * @param {any} args 
     * @memberof BaseModel
     */
	constructor(...args) {
		super(...args);
	}

    /**
     * Init model
     * 
     * @static
     * @param {Object} attributes 
     * @param {Object} options 
     * @returns 
     * @memberof BaseModel
     */
	static init(attributes, options) {
		return super.init(attributes, {
			...options,
			hooks: {
				...options.hooks
			}
		});
	}

	/**
	 * Overide findOne method
	 * 
	 * @static
	 * @param {any} options 
	 * @returns 
	 * @memberof BaseModel
	 */
	static findOne(options) {
		return super.findOne(options);
	}

	/**
	 * Overide findAll method
	 * 
	 * @static
	 * @param {any} options
	 * @returns 
	 * @memberof BaseModel
	 */
	static findAll(options) {
		return super.findAll(options);
	}

	/**
	 * Overide update method
	 * 
	 * @static
	 * @param {any} values 
	 * @param {any} options 
	 * @returns 
	 * @memberof BaseModel
	 */
	static update(values, options) {
		return super.update(values, {individualHooks: true, ...options});
	}

	/**
	 * Overide destroy method
	 * 
	 * @static
	 * @param {any} options 
	 * @returns 
	 * @memberof BaseModel
	 */
	static destroy(options) {
		return super.destroy({individualHooks: true, ...options})
	}

	/**
	 * Init associations
	 * 
	 * @static
	 * @memberof BaseModel
	 */
	static association() {
        
	}

	/**
	 * Function clear cache
	 * 
	 * @memberof BaseModel
	 */
	clearCache() {}
}