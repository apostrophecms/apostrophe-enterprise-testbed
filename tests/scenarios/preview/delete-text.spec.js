const cheerio = require('cheerio');
const request = require('request');
const server = require('../apostrophe-nightwatch-tools/server');
const steps = require('../../steps');

module.exports = Object.assign(
  {
    before: (client, done) => {
      client.resizeWindow(1200, 800);
      if (!this._server) {
        this._server = server.create('localhost', 3111);
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
  steps.switchLocale('fr'),
  steps.switchToDraftMode(),
  steps.makeSubPage('Regression test'),
  steps.addTextWidgetTo({selector: '.demo-main', text: 'Rich Text Widget line'}),
  steps.commitAndExport(),
  {
    'delete Rich Text widget from the page': function(client) {
      const contentMainBlockSelector = '.demo-main';
      const trashBtnSelector = `${contentMainBlockSelector} [data-apos-trash-item]`;
      const richTextSelector = `${contentMainBlockSelector} [data-rich-text]`;

      client.moveToElement(trashBtnSelector, 5, 5);
      client.clickWhenReady(trashBtnSelector);

      client.expect.element(richTextSelector).to.not.be.present;
    }
  },
  {
    'should show removed text in the commit preview': function(client) {
      const commitBtnSelector = '[data-apos-workflow-commit]';
      const modalDialogSelector = '.apos-workflow-commit-modal';
      const skipExportBtnSelector = '.apos-workflow-export-modal [data-apos-cancel]';
      const deletedDiffSelector = '.apos-workflow-widget-diff--deleted';
      const confirmBtnSelector = `[data-apos-save]`;

      client.pause(200);
      client.waitForElementReady(commitBtnSelector);
      client.clickWhenReady(commitBtnSelector);
      client.waitForElementReady(modalDialogSelector);
      client.frame(0);

      client.expect.element(deletedDiffSelector).to.be.visible.before(15000);
      client.expect.element(deletedDiffSelector).text.to.equal('Rich Text Widget line');

      client.frameParent();
      client.clickWhenReady(confirmBtnSelector);
      client.waitForElementReady(skipExportBtnSelector);
      client.clickWhenReady(skipExportBtnSelector);
    }
  },
  steps.makeIncognitoRequestByRelativeUrl('/', (client, $) => {
    const richTextSelector = '.demo-main [data-rich-text]';

    client.assert.equal($(richTextSelector).length, 0);
  }),
);
