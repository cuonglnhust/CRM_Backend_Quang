var moment = require('moment-timezone');

module.exports = {
	nowDate: () => {
        return moment.tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD');
    },

    addDay: (time, add) => {
        return moment(time).add(add, 'days').format('YYYY-MM-DD');
    },

    subtractDay: (time, sub) => {
        return moment(time).subtract(sub, 'days').format('YYYY-MM-DD');
    },
    subtractHour: (time, sub) => {
        return moment(time).subtract(sub, 'hour').format('YYYY-MM-DD HH:mm:ss');
    },
    getTimestamp: (time) => {
    	return moment(time).unix();
    },
    unixToTime: (time) => {
        return moment.unix(time).format('YYYY-MM-DD');
    },
    convertTime: (time) => {
        return moment.tz(time, 'Asia/Ho_Chi_Minh').format('YYYY-MM-DD HH:mm:ss');
    },
    convertTimeCart : (time) => {
        return moment.tz(time, 'Asia/Ho_Chi_Minh').format('HH:mm DD-MM-YYYY');
    },
    convertTimeDate: (time) => {
        return moment.tz(time, 'Asia/Ho_Chi_Minh').format();
    }
}