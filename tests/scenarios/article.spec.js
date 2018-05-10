const server = require('../server');
const steps = require('../steps');

module.exports = Object.assign(
  {
    before: (client, done) => {
      const address = client.globals.test_settings.apos_address;
      const port = client.globals.test_settings.apos_port;
      client.resizeWindow(1200, 800);

      this._server = server.create(address, port);
      this._server.start(done);
    },

    after: (client, done) => {
      client.end(() => {
        this._server.stop(done);
      });
    },
  },
  steps.main(),
  steps.login(),
  steps.switchLocale('en'),
  steps.switchToDraftMode(),
);
