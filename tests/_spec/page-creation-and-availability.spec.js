const steps = require('../steps');
const setup = require('..specSetup/')

module.exports = Object.assign(
  setup,
  steps.main(),
  steps.login(),
  steps.switchLocale('en'),
  steps.switchToDraftMode(),
  steps.makeSubPage('Regression test'),
  steps.submitChanges(),
  steps.checkSubmitted(['Regression test']),
  steps.switchToLiveMode(),
  steps.confirm404ByRelativeUrl('regression-test'),
  steps.switchToDraftMode(),
  steps.navigateToPage('regression-test'),
  steps.commitAndExport(),
  steps.navigateToHome(),
  steps.switchToLiveMode(),
  steps.confirm200ByRelativeUrl('regression-test'),
  steps.switchToDraftMode(),
  steps.navigateToPage('regression-test'),
  steps.changePageTypeTo('Alternate Page'),
);
