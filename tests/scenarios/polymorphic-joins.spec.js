const server = require('apostrophe-nightwatch-tools/server');
const steps = require('apostrophe-nightwatch-tools/steps');

module.exports = Object.assign(
  {
    before: (client, done) => {
      const { apos_address, apos_port } = client.globals;
      client.resizeWindow(1200, 800);
      this._server = server.create(apos_address, apos_port);
      process.env.PRODUCTS_PAGE = "1";
      process.env.ARTICLES_PAGE = "1";
      this._server.start((err) => {
        if (err) {
          console.error(err);
          return done(err);
        }
        this._server.task('apostrophe-blog:generate --total=50');
        this._server.task('products:generate --total=50');
        // Migration task must not crash when run noninteractively (pipe to file)
        if (this._server.task('apostrophe-migrations:migrate > /tmp/migrate.results').code !== 0) {
          return done('MIGRATION ERROR');
        }
        return done();
      });
    },

    after: (client, done) => {
      delete process.env.PRODUCTS_PAGE;
      delete process.env.ARTICLES_PAGE;
      client.end(() => {
        this._server.stop(function() {
          done();
        });
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
      const browseBtnSelector = '[data-apos-browse]';
      const articleCheckboxSelector = '.apos-apostrophe-blog-manager .apos-manage-table tr[data-piece] .apos-field-input-checkbox-indicator';
      const productCheckboxSelector = '.apos-product-manager .apos-manage-table tr[data-piece] .apos-field-input-checkbox-indicator';
      const regressionTestPageCheckboxSelector = '[data-apos-reorganize-depth="2"] input[type="checkbox"]';
      const saveChoicesBtnSelector = '[data-apos-save]';
      const saveWidgetBtnSelector = '[data-apos-save]';
      // To make sure we scroll down far enough to eliminate certain conflicts
      client.getLocationInView('footer');
      client.clickWhenReady(addContentBtnSelector);
      client.clickWhenReady(mixedWidgetBtnSelector);
      client.clickInModal('mixed-widgets-editor', browseBtnSelector)
      client.clickInModal('apostrophe-polymorphic-manager-manager-modal', articleCheckboxSelector);
      client.clickInModal('apostrophe-polymorphic-manager-manager-modal', '[data-tab-button="product"]');
      client.clickInModal('apostrophe-polymorphic-manager-manager-modal', productCheckboxSelector);
      client.clickInModal('apostrophe-polymorphic-manager-manager-modal', '[data-tab-button="apostrophe-page"]');
      client.clickInModal('apostrophe-polymorphic-manager-manager-modal', regressionTestPageCheckboxSelector);
      client.clickInModal('apostrophe-polymorphic-manager-manager-modal', saveChoicesBtnSelector);
      client.pause(5000);
      client.clickInModal('mixed-widgets-editor', saveWidgetBtnSelector);
      client.waitForElementReady('[data-apos-widget="mixed"] a[href="http://localhost:3111/en/articles/article-1"]');
      client.waitForElementReady('[data-apos-widget="mixed"] a[href="http://localhost:3111/en/products/product-01"]');
      client.waitForElementReady('[data-apos-widget="mixed"] a[href="http://localhost:3111/en/products"]');
      client.expect.element('[data-apos-widget="mixed"] a[href="http://localhost:3111/en/regression-test"]').to.not.be.present;
      client.categoryScreenshot('polymorphic-joins.png');
    }
  }
);
