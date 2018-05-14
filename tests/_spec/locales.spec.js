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
