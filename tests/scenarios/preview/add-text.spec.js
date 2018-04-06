const cheerio = require('cheerio');
const request = require('request');
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
  steps.addTextWidgetTo({selector: '.demo-main', text: 'Rich Text Widget line'}),
  {
    'should show added text in the commit preview': function(client) {
      const commitBtnSelector = '[data-apos-workflow-commit]';
      const modalDialogSelector = '.apos-workflow-commit-modal';
      const skipExportBtnSelector = '.apos-workflow-export-modal [data-apos-cancel]';
      const newDiffSelector = '.apos-workflow-widget-diff--new';
      const confirmBtnSelector = `[data-apos-save]`;

      client.waitForElementVisible(commitBtnSelector);
      client.click(commitBtnSelector);
      client.waitForElementVisible(modalDialogSelector);
      client.frame(0);

      client.expect.element(newDiffSelector).to.be.visible.before(10000);
      client.expect.element(newDiffSelector).text.to.equal('Rich Text Widget line').before(0);

      client.frameParent();
      client.click(confirmBtnSelector);
      client.waitForElementVisible(skipExportBtnSelector);
      client.click(skipExportBtnSelector);
    }
  },
  {
    'check new text widget in incognito mode': function(client) {
      const richTextSelector = '.demo-main [data-rich-text]';

      client.perform((done) => {
        client.url((res) => {
          request(res.value, (error, response, body) => {
            const $ = cheerio.load(body);

            client.assert.equal(response.statusCode, 200);
            client.assert.ok($(richTextSelector).length);
            client.assert.equal($(richTextSelector).text(), 'Rich Text Widget line\n');

            done();
          });
        });
      });
    }
  },
);
