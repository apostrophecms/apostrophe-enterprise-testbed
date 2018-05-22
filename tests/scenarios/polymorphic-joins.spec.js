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
  steps.switchToDraftMode(),
  steps.makeSubPage('Regression test'),
  {
    'add a mixed widget to the page': (client) => {
      const mainBlockSelector = '.demo-main';
      const addContentBtnSelector = `${mainBlockSelector} [data-apos-add-content]`;
      const mixedWidgetBtnSelector = `${mainBlockSelector} [data-apos-add-item=mixed]`;
      const modalDialogSelector = '.apos-modal.apos-modal-slideable';
      const selectBlogTypeSelector = '.apos-field-select select';
      const browseBtnSelector = '[data-apos-browse]';
      // const articleCheckboxSelector = '.apos-manage-table tr[data-piece] .apos-field-input-checkbox-indicator';
      // const busyLayerSelector = '.apos-global-busy.active';
      // const saveChoicesBtnSelector = '[data-apos-modal-depth="1"] [data-apos-save]';
      // const saveBlogBtnSelector = '[data-apos-modal-depth="0"] [data-apos-save]';
      // const blogArticleTitleSelector = '.blog-card-title-container';

      client.click(addContentBtnSelector);
      client.waitForElementVisible(mixedWidgetBtnSelector);
      client.click(mixedWidgetBtnSelector);
      client.waitForElementVisible(modalDialogSelector);
      client.setValue(selectBlogTypeSelector, 'Individually');
      client.waitForElementVisible(browseBtnSelector);
      client.click(browseBtnSelector);
      // client.waitForElementVisible(articleCheckboxSelector);
      // client.click(articleCheckboxSelector);
      // client.waitForElementVisible(saveChoicesBtnSelector);
      // client.click(saveChoicesBtnSelector);
      // client.waitForElementVisible(saveBlogBtnSelector);
      // client.click(saveBlogBtnSelector);
      // client.useCss();    }
    }
  }
);
