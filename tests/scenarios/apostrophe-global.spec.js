const steps = require('apostrophe-nightwatch-tools/steps');
const server = require('apostrophe-nightwatch-tools/server');

module.exports = Object.assign(
  {
    before: (client, done) => {
      const { apos_address, apos_port } = client.globals;
      client.resizeWindow(1200, 800);
      if (!this._server) {
        this._server = server.create(apos_address, apos_port);
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
  steps.switchLocale('es'),
  steps.switchToDraftMode(),
  steps.makeSubPage('Regression test'),
  steps.commitAndExport(),
  steps.addTextWidgetTo({selector: '.footer', text: 'Rich Text Widget line global'}),
  steps.commitAndExport(),
  steps.switchLocale('en'),
  {
    'should have the Rich Text widget in the footer': function(client) {
      const richTextSelector = `.footer [data-rich-text]`;

      client.expect.element(richTextSelector).text.to.contain('Rich Text Widget line global');
      // To get the footer onscreen for a better screenshot
      client.getLocationInView('footer');
      client.categoryScreenshot('apostrophe-global.png');
    }
  }
  );
