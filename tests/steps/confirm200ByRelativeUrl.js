const request = require('request');
let counter = 0;

module.exports = (url) => {
  counter++;

  return {
    [`[${counter}] confirm 200 for relative url "${url}"`]: function(client) {
      client.perform((done) => {
        client.url((res) => {
          const locator = `${res.value}${url}`;

          console.log(locator);
          request(locator, (error, response, body) => {
            client.assert.equal(response.statusCode, 200);

            done();
          });
        });
      });
    }
  };
};
