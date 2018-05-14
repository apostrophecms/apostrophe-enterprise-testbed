const steps = require('../steps');
const setup = require('../specSetup')

module.exports = Object.assign(
  setup,
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
  steps.confirm200ByRelativeUrl('regression-test'),
  steps.navigateToPage('regression-test'),
  {
    'should have the Rich Text widget': function(client) {
      const richTextSelector = `.demo-main [data-rich-text]`;

      client.expect.element(richTextSelector).text.to.contain('Rich Text Widget line');
    }
  },
);
