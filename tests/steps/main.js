const server = require('../server');
let counter = 0;

module.exports = () => {
  counter++;

  return {
    [`[${counter}] main`]: function(client) {
      const address = client.globals.test_settings.apos_address;
      const port = client.globals.test_settings.apos_port;
      const url = `http://${address}:${port}`;
      client
        .url(url)
        .waitForElementReady('body.home-page', 10000);
    }
  };
};
