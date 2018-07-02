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
  steps.addTextWidgetTo({selector: '.demo-main', text: 'Rich Text Widget line'}),
  steps.submitChanges(),
  steps.commitAndExport(),
  steps.switchToLiveMode(),
  steps.navigateToHome(),
  /*{
    'pause': client => {
      client.pause();
    }
  },
  */
  //steps.confirm200ByRelativeUrl('regression-test'),
  steps.navigateToPage('regression-test'),
  {
    'should have the Rich Text widget': function(client) {
      const richTextSelector = `.demo-main [data-rich-text]`;

      client.expect.element(richTextSelector).text.to.contain('Rich Text Widget line');
      client.categoryScreenshot('text-widget.png');
    }
  },
);
