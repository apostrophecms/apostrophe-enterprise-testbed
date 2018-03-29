const server = require('../server');
const steps = require('../steps');

module.exports = Object.assign(
  {
    before: (client, done) => {
      client.resizeWindow(1200, 800);

      this._server = server.create();
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
  steps.makeSubPage('Regression test'),
  steps.submitChanges(),
  steps.checkSubmitted('Regression test'),
  steps.switchToLiveMode(),
  steps.confirm404ByRelativeUrl('regression-test'),
  steps.switchToDraftMode(),
  steps.navigateToPage('regression-test'),
  steps.commitChanges(),
  steps.navigateToHome(),
  steps.switchToLiveMode(),
  steps.confirm200ByRelativeUrl('regression-test'),
);
