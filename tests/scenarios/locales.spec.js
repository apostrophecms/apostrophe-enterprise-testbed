const server = require('apostrophe-nightwatch-tools/server');
const steps = require('apostrophe-nightwatch-tools/steps');

module.exports = Object.assign(
  {
    before: (client, done) => {
      client.resizeWindow(1200, 1200);
      if (!this._server) {
        this._server = server.create('localhost', 3111);
        this._server.start(done);
      }
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
  steps.makeSubPage('Regression test'),
  steps.commit(),
  steps.navigateToHome(),
  steps.switchLocale('fr'),
  steps.navigateToHome(),
  steps.switchLocale('en'),
  {
    'Check URL' : function(client) {
      client.assert.urlContains('en');
      client.categoryScreenshot('locales.png');
    }
  },
  steps.navigateToHome()
);
