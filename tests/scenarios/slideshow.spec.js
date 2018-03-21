const server = require('../server');
const steps = require('../steps');

module.exports = Object.assign(
  steps.main,
  steps.login,
  steps.switchLocale('en'),
  steps.switchToDraftMode,
  steps.makeSubPage('Regression test'),
  steps.submitChanges,
  steps.checkSubmitted('Regression test'),
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
    client.pause(3000);
    client.saveScreenshot('look-at-me.png');
  }
});
