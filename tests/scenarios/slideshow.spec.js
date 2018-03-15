const server = require('../server');
const steps = require('../steps');

module.exports = Object.assign(
  steps.main,
  steps.login,
  steps.switchLocale('en'),
  steps.switchToDraftMode,
{
  before: (client, done) => {
    client.resizeWindow(1200, 800);

    this._server = server.create();
    this._server.start(done);
  },

  after: (client, done) => {
    client.end();
    this._server.stop(done);
  },

  flow(client) {
    client.saveScreenshot('look-at-me.png');
  }
});
