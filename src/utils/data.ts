const axios = require('axios');

function dataHandler(method, url, headers, data) {
    const res = axios(
        {
          method,
          url,
          headers,
          data
        });

    return res
}

module.exports = dataHandler;

