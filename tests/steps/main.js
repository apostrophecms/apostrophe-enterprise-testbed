const server = require('../server');
let counter = 0;

module.exports = () => {
  counter++;

  return {
    [`[${counter}] main`]: function(client) {
      const address = client.globals.test_settings.apos_address;
      const port = client.globals.test_settings.apos_port;
      const url = `http://${address}:${port}`;
      console.log('MAIN', client.globals.test_settings, url);
      client
        .url(url)
        .pause(2000);
      client.expect.element('body.home-page').to.be.present;
    }
  };
};
