const url = require('url');
const cheerio = require('cheerio');
const request = require('request');

let counter = 0;

module.exports = (relativeUrl, cb) => {
  counter++;

  if (typeof relativeUrl === 'function') {
    cb = relativeUrl;
    relativeUrl = '';
  }

  return {
    [`[${counter}] make incognito request by relative url "${relativeUrl}"`]: function(client) {
      client.perform((done) => {
        client.url((res) => {
          const locator = url.resolve(res.value, relativeUrl);

          request(locator, (error, response, body) => {
            client.assert.equal(response.statusCode, 200);

            cb(client, cheerio.load(body));
            done();
          });
        });
      });
    }
  };
};
