const server = require('apostrophe-nightwatch-tools/server');
const steps = require('apostrophe-nightwatch-tools/steps');
const sauce = require('../sauce');

module.exports = Object.assign(
  {
    before: (client, done) => {
      client.resizeWindow(1200, 800);
      if (!this._server) {
        this._server = server.create('localhost', 3111);
        this._server.start(done);
      }
    },
    afterEach: sauce,
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
  steps.makeSubPage('Regression test'),
  steps.submitChanges(),
  steps.checkSubmitted(['Regression test']),
  {
    'confirm regression-test page url': client => {
      client.assert.urlEquals('http://localhost:3111/en/regression-test');
    }
  },
  steps.switchToLiveMode(),
  steps.switchToDraftMode(),
  steps.navigateToPage('regression-test'),
  steps.commitAndExport(),
  steps.navigateToHome(),
  steps.switchToLiveMode(),
  steps.switchToDraftMode(),
  steps.navigateToPage('regression-test'),
  steps.changePageTypeTo('Alternate Page'),
  {
    'screenshot alternate page': client => {
      client.saveScreenshot('screenshots/latest/page-creation-and-availability.png');
    }
  }
);
