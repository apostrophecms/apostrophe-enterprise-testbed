const server = require('../server');
const steps = require('../steps/index');

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
  steps.createArticle('New Blog Article Title'),
  {
    'add a blog widget to the regression test page': (client) => {
      const finishBtnSelector = '[data-apos-cancel]';
      const blackoutSelector = '.apos-modal-blackout';
      const mainBlockSelector = '.demo-main';
      const addContentBtnSelector = `${mainBlockSelector} [data-apos-add-content]`;
      const blogWidgetBtnSelector = `${mainBlockSelector} [data-apos-add-item=apostrophe-blog]`;
      const modalDialogSelector = '.apos-modal.apos-modal-slideable';
      const selectBlogTypeSelector = '.apos-field-select select';
      const browseBtnSelector = '[data-apos-browse]';
      const articleCheckboxSelector = '.apos-manage-table tr[data-piece] .apos-field-input-checkbox-indicator';
      const busyLayerSelector = '.apos-global-busy.active';
      const saveChoicesBtnSelector = '(//a[@data-apos-save])[2]';
      const saveBlogBtnSelector = '(//a[@data-apos-save])[1]';
      const blogArticleTitleSelector = '.blog-card-title-container';

      client.click(finishBtnSelector);
      client.waitForElementNotPresent(blackoutSelector);
      client.waitForElementVisible(addContentBtnSelector);
      client.click(addContentBtnSelector);
      client.getLocationInView('footer');
      client.waitForElementVisible(blogWidgetBtnSelector);
      client.pause(1000);
      client.click(blogWidgetBtnSelector);

      // ✖ Timed out while waiting for element <.apos-modal.apos-modal-slideable>
      // to be present for 5000 milliseconds.  - expected "visible" but got: "not found"

      client.saveScreenshot('./look-at-me.png');

      client.waitForElementVisible(modalDialogSelector);
      client.setValue(selectBlogTypeSelector, 'Individually');
      client.waitForElementVisible(browseBtnSelector);
      client.click(browseBtnSelector);
      client.waitForElementVisible(articleCheckboxSelector);
      client.click(articleCheckboxSelector);
      client.waitForElementNotPresent(busyLayerSelector);
      client.useXpath();
      client.click(saveChoicesBtnSelector);
      client.waitForElementVisible(saveBlogBtnSelector);
      client.click(saveBlogBtnSelector);
      client.useCss();

      client.expect.element(blogArticleTitleSelector).text.to.equal('New Blog Article Title');
    }
  },
  steps.commitAndExport(2),
  steps.switchLocale('fr'),
  {
    'should have a blog widget': function(client) {
      const blogArticleTitleSelector = '.blog-card-title-container';

      client.expect.element(blogArticleTitleSelector).text.to.equal('New Blog Article Title');
    }
  },
);
