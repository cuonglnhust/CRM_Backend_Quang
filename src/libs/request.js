import axios from 'axios';

const makeRequest = (method, url, params={}, header='', timeout = 5000) => {
    return new Promise((resolve, reject) => {
        method = method.toLowerCase();
        let opts = {
            method : method,
            url: url
        };

        if (method == 'get')
            opts.params = params;
        else 
            opts.data = params;

        if (header) {
            opts.headers = header;
        }

        axios(opts).then(response => {
            let result = response.data
            resolve(result);
        }).catch(err => {
            reject('Something went wrong!');
        });
    });
}

module.exports = {makeRequest};