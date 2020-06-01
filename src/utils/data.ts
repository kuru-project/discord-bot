const axios = require('axios');

interface IProps {
  readonly method: string;
  readonly url: string;
  readonly headers: string;
  readonly data: string;
}

function dataHandler(method, url, headers, data): IProps {
  const res = axios(
    {
      method,
      url,
      headers,
      data,
    });

  return res;
}

module.exports = dataHandler;

