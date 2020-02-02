const server = require('apostrophe-nightwatch-tools/server');
const steps = require('apostrophe-nightwatch-tools/steps');

module.exports = Object.assign(
  {
    before: (client, done) => {
      client.resizeWindow(1200, 1200);
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
  steps.switchLocale('es'),
  steps.makeSubPage('Regression test'),
  steps.createArticle('New Blog Article Title'),
  {
    'add a blog widget to the regression test page': (client) => {
      const blackoutSelector = '.apos-modal-blackout';
      const mainBlockSelector = '.demo-main';
      const addContentBtnSelector = `${mainBlockSelector} [data-apos-add-content]`;
      const blogWidgetBtnSelector = `${mainBlockSelector} [data-apos-add-item=apostrophe-blog]`;
      const modalDialogSelector = '.apos-modal.apos-modal-slideable';
      const selectBlogTypeSelector = '.apos-field-select select';
      const browseBtnSelector = '[data-apos-browse]';
      const articleCheckboxSelector = '.apos-manage-table tr[data-piece] .apos-field-input-checkbox-indicator';
      const busyLayerSelector = '.apos-global-busy.active';
      const blogArticleTitleSelector = '.blog-card-title-container';

      client.clickInModal('apostrophe-blog-manager-modal', '[data-apos-cancel]');
      client.waitForNoModals();
      client.waitForElementReady(addContentBtnSelector);
      client.click(addContentBtnSelector);
      client.getLocationInView('footer');
      client.waitForElementReady(blogWidgetBtnSelector);
      client.click(blogWidgetBtnSelector);
      client.resetValueInModal('apostrophe-blog-widgets-editor', selectBlogTypeSelector, 'Individually');
      client.clickInModal('apostrophe-blog-widgets-editor', browseBtnSelector);
      client.clickInModal('apostrophe-blog-manager-modal', articleCheckboxSelector);
      client.clickInModal('apostrophe-blog-manager-modal', '[data-apos-save]');
      client.clickInModal('apostrophe-blog-widgets-editor', '[data-apos-save]');

      client.expect.element(blogArticleTitleSelector).text.to.equal('New Blog Article Title');
    }
  },
  steps.commitAndExport(2),
  steps.switchLocale('fr'),
  {
    'should have a blog widget': function(client) {
      const blogArticleTitleSelector = '.blog-card-title-container';

      client.expect.element(blogArticleTitleSelector).text.to.equal('New Blog Article Title');
      // To get the footer onscreen for a better screenshot
      client.getLocationInView('footer');
      client.categoryScreenshot('blog-widget.png');
    }
  },
);
