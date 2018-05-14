const steps = require('../steps/index');
const server = require('../server');
const setup = require('../specSetup');

module.exports = Object.assign(
  setup,
  steps.main(), /*
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
  } */
  );
