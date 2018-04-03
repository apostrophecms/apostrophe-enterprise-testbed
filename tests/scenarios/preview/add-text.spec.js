const server = require('../../server');
const steps = require('../../steps/index');

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
  steps.switchLocale('es'),
  steps.switchToDraftMode(),
  steps.makeSubPage('Regression test'),
  steps.addTextWidgetToPage('Rich Text Widget line'),
  {
    'should show added text in the commit preview': function(client) {
      const commitBtnSelector = '[data-apos-workflow-commit]';
      const modalDialogSelector = '.apos-workflow-commit-modal';
      const newDiffSelector = '.apos-workflow-widget-diff--new';

      client.pause(200);
      client.waitForElementVisible(commitBtnSelector, 5000);
      client.click(commitBtnSelector);
      client.waitForElementVisible(modalDialogSelector, 5000);
      client.frame(0);

      client.expect.element(newDiffSelector).to.be.visible.before(5000);
      client.expect.element(newDiffSelector).text.to.equal('Rich Text Widget line');

      client.pause(5000);
    }
  }
);
