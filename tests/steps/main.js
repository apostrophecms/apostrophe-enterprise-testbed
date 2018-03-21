const server = require('../server');
let counter = 0;

module.exports = () => {
  counter++;

  return {
    [`[${counter}] main`]: function(client) {
      client
        .url(server.URL)
        .pause(1000);

      client.expect.element('body.home-page').to.be.present;
    }
  };
};
