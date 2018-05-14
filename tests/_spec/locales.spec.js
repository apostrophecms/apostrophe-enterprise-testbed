 const steps = require('../steps');
 const setup = require('../specSetup')

 module.exports = Object.assign(
   setup,
   steps.main(),
   steps.login(),
   steps.switchLocale('en'),
   steps.switchToDraftMode(),
   steps.makeSubPage('Regression test'),
   steps.commit(),
   steps.navigateToHome(),
   steps.switchLocale('fr'),
   steps.navigateToRelativeUrlAndconfirm404('regression-test'),
   steps.navigateToHome(),
   steps.switchLocale('en'),
   steps.navigateToRelativeUrl('regression-test'),
   steps.forceExportCurrentPageFor('fr'),
   steps.confirm404ByRelativeUrl('regression-test'),
   steps.navigateToHome(),
   steps.switchLocale('fr'),
   steps.navigateToRelativeUrl('regression-test'),
   steps.commit(),
   steps.navigateToHome(),
   steps.confirm200ByRelativeUrl('regression-test'),
 );
