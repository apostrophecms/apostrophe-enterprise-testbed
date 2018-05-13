const server = require('../server');
const steps = require('../steps/index');

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
    }
  },
);
