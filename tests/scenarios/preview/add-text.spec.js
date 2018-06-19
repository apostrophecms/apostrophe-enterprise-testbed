const cheerio = require('cheerio');
const request = require('request');
const server = require('../../server');
const steps = require('../../steps/index');
const sauce = require('../../sauce');

module.exports = Object.assign(
  {
    before: (client, done) => {
      client.resizeWindow(1200, 800);
      if (!this._server) {
        this._server = server.create('localhost', 3111);
        this._server.start(done);
      }
    },
    afterEach: sauce,
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
  steps.addTextWidgetTo({selector: '.demo-main', text: 'Rich Text Widget line'}),
  {
    'should show added text in the commit preview': function(client) {
      const commitBtnSelector = '[data-apos-workflow-commit]';
      const modalDialogSelector = '.apos-workflow-commit-modal';
      const skipExportBtnSelector = '.apos-workflow-export-modal [data-apos-cancel]';
      const newDiffSelector = '.apos-workflow-widget-diff--new';
      const confirmBtnSelector = `[data-apos-save]`;

      client.waitForElementReady(commitBtnSelector);
      client.clickWhenReady(commitBtnSelector);
      client.waitForElementReady(modalDialogSelector);
      client.frame(0);

      client.expect.element(newDiffSelector).to.be.visible.before(15000);
      client.expect.element(newDiffSelector).text.to.equal('Rich Text Widget line').before(0);

      client.frameParent();
      client.clickWhenReady(confirmBtnSelector);
      client.waitForElementReady(skipExportBtnSelector);
      client.clickWhenReady(skipExportBtnSelector);
    }
  },
  steps.makeIncognitoRequestByRelativeUrl((client, $) => {
    const richTextSelector = '.demo-main [data-rich-text]';

    client.assert.ok($(richTextSelector).length);
    client.assert.equal($(richTextSelector).text(), 'Rich Text Widget line\n');
  }),
);
