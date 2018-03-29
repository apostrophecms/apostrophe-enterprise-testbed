const _ = require('lodash');
const server = require('../server');
const steps = require('../steps');

const contentMainBlockSelector = '.demo-main';
const richTextSelector = `${contentMainBlockSelector} [data-rich-text]`;

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
  {
    'add Rich Text widget': function(client) {
      const addContentBtnSelector = `${contentMainBlockSelector} [data-apos-add-content]`;
      const richTextBtnSelector = `${contentMainBlockSelector} [data-apos-add-item=apostrophe-rich-text]`;

      client.click(addContentBtnSelector);
      client.click(addContentBtnSelector);
      client.click(richTextBtnSelector);
      client.pause(1000);
      client.execute(function () {
        const ckeditorInstance = _.find(CKEDITOR.instances);

        ckeditorInstance.setData('Rich Text Widget line');
      });

      client.expect.element(richTextSelector).text.to.contain('Rich Text Widget line');
    }
  },
  steps.submitChanges(),
  steps.commitChanges(),
  steps.switchToLiveMode(),
  steps.navigateToHome(),
  steps.confirm200ByRelativeUrl('regression-test'),
  steps.navigateToPage('regression-test'),
  {
    'should have the Rich Text widget': function(client) {
      client.expect.element(richTextSelector).text.to.contain('Rich Text Widget line');
    }
  },
);
