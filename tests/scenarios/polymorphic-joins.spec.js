const server = require('../server');
const steps = require('../steps/index');

module.exports = Object.assign(
  {
    before: (client, done) => {
      const { apos_address, apos_port } = client.globals.test_settings;
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
      const saveChoicesBtnSelector = '[data-apos-modal-depth="1"] [data-apos-save]';
      const saveWidgetBtnSelector = '[data-apos-modal-depth="0"] [data-apos-save]';

      client.waitForElementReady(addContentBtnSelector);
      client.clickWhenReady(addContentBtnSelector);
      client.waitForElementReady(mixedWidgetBtnSelector);
      client.clickWhenReady(mixedWidgetBtnSelector);
      client.waitForElementReady(modalDialogSelector);
      client.waitForElementReady(browseBtnSelector);
      client.clickWhenReady(browseBtnSelector);
      client.waitForElementReady(articleCheckboxSelector);
      client.clickWhenReady(articleCheckboxSelector);
      client.waitForElementReady('[data-tab-button="product"]');
      client.clickWhenReady('[data-tab-button="product"]');
      client.waitForElementReady(productCheckboxSelector);
      client.clickWhenReady(productCheckboxSelector);
      client.clickWhenReady('[data-tab-button="apostrophe-page"]');
      client.waitForElementReady(regressionTestPageCheckboxSelector);
      client.clickWhenReady(regressionTestPageCheckboxSelector);
      client.clickWhenReady(saveChoicesBtnSelector);
      client.waitForElementReady(saveWidgetBtnSelector);
      client.clickWhenReady(saveWidgetBtnSelector);
      client.waitForElementReady('[data-apos-widget="mixed"] a[href="http://localhost:3111/en/articles/article-1"]');
      client.waitForElementReady('[data-apos-widget="mixed"] a[href="http://localhost:3111/en/products/product-50"]');
      client.waitForElementReady('[data-apos-widget="mixed"] a[href="http://localhost:3111/en/products"]');
      client.expect.element('[data-apos-widget="mixed"] a[href="http://localhost:3111/en/regression-test"]').to.not.be.present;
    }
  }
);
