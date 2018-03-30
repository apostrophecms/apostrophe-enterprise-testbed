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
  steps.addTextWidgetToPage('Rich Text Widget line'),
  steps.submitChanges(),
  steps.commitChanges(),
  steps.switchToLiveMode(),
  steps.navigateToHome(),
  steps.confirm200ByRelativeUrl('regression-test'),
  steps.navigateToPage('regression-test'),
  {
    'should have the Rich Text widget': function(client) {
      const richTextSelector = `.demo-main [data-rich-text]`;

      client.expect.element(richTextSelector).text.to.contain('Rich Text Widget line');
    }
  },
);
