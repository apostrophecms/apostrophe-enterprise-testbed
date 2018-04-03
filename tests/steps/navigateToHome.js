const server = require('../server');
let counter = 0;

module.exports = () => {
  counter++;

  return {
    [`[${counter}] navigate to home page`]: function(client) {
      client.url(server.URL);
      client.waitForElementVisible('body');
    }
  };
};
