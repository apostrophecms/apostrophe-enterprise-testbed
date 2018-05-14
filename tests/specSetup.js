const server = require('./server');
const sauce = require('./sauce');
const chromedriver = require('chromedriver');

function isLocalRunning() {
  return this.test_settings.selenium_host === 'localhost';
}

module.exports = {
    before: (client, done) => {
      console.log('SPEC - before');
      const address = client.globals.test_settings.apos_address;
      const port = client.globals.test_settings.apos_port;
      client.resizeWindow(1200, 800);

      this._server = server.create(address, port);
      this._server.start(done);
    },
    afterEach: (client, done) => {
      console.log('SPEC - after each')
      return sauce(client, done);
    },
    after: (client, done) => {
      console.log('SPEC - after all');
      return done();
    }
  };
