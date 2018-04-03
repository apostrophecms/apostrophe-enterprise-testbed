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
  steps.switchLocale('fr'),
  steps.switchToDraftMode(),
  steps.makeSubPage('Regression test'),
  steps.addTextWidgetToPage('Rich Text Widget line'),
  steps.commitChanges(),
  {
    'delete Rich Text widget from the page': function(client) {
      const contentMainBlockSelector = '.demo-main';
      const trashBtnSelector = `${contentMainBlockSelector} [data-apos-trash-item]`;
      const richTextSelector = `${contentMainBlockSelector} [data-rich-text]`;

      client.click(trashBtnSelector);

      client.expect.element(richTextSelector).to.not.be.present.before(5000)
    }
  },
  {
    'should show removed text in the commit preview': function(client) {
      const commitBtnSelector = '[data-apos-workflow-commit]';
      const modalDialogSelector = '.apos-workflow-commit-modal';
      const deletedDiffSelector = '.apos-workflow-widget-diff--deleted';

      client.pause(200);
      client.waitForElementVisible(commitBtnSelector, 5000);
      client.click(commitBtnSelector);
      client.waitForElementVisible(modalDialogSelector, 5000);
      client.frame(0);

      client.expect.element(deletedDiffSelector).to.be.visible.before(5000);
      client.expect.element(deletedDiffSelector).text.to.equal('Rich Text Widget line');

      client.pause(5000);
    }
  }
);
