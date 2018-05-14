const steps = require('../steps');
const setup = require('../specSetup');

module.exports = Object.assign(
  setup,
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
      const saveChoicesBtnSelector = '[data-apos-modal-depth="1"] [data-apos-save]';
      const saveBlogBtnSelector = '[data-apos-modal-depth="0"] [data-apos-save]';
      const blogArticleTitleSelector = '.blog-card-title-container';

      client.click(finishBtnSelector);
      client.waitForElementNotPresent(blackoutSelector);
      client.waitForElementVisible(addContentBtnSelector);
      client.click(addContentBtnSelector);
      client.getLocationInView('footer');
      client.waitForElementVisible(blogWidgetBtnSelector);
      client.pause(1000);
      client.click(blogWidgetBtnSelector);
      client.waitForElementVisible(modalDialogSelector);
      client.setValue(selectBlogTypeSelector, 'Individually');
      client.waitForElementVisible(browseBtnSelector);
      client.click(browseBtnSelector);
      client.waitForElementVisible(articleCheckboxSelector);
      client.click(articleCheckboxSelector);
      client.waitForElementVisible(saveChoicesBtnSelector);
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
