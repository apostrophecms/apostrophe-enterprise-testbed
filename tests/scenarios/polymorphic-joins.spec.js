const server = require('../server');
const steps = require('../steps/index');

module.exports = Object.assign(
  {
    before: (client, done) => {
      console.log('*** IJN BEFORE');
      const { apos_address, apos_port } = client.globals.test_settings;
      client.resizeWindow(1200, 800);
      this._server = server.create(apos_address, apos_port);
      this._server.start((err) => {
        if (err) {
          console.log('ERR:');
          console.log(err);
          return done(err);
        }
        console.log('running tasks:');
        this._server.task('apostrophe-blog:generate --total=50');
        this._server.task('products:generate --total=50');
        console.log('INVOKING DONE');
        return done();
      });
    },

    after: (client, done) => {
      client.end(() => {
        this._server.stop(done);
      });
    },
  },
  {
    'check': (client) => {
      console.log('MOVING RIGHT ON I GUESS');
    }
  },
  steps.main(),
  steps.login(),
  steps.switchToDraftMode(),
  steps.makeSubPage('Regression test'),
  {
    'add a mixed widget to the page': (client) => {
      console.log('running');
      const mainBlockSelector = '.demo-main';
      const addContentBtnSelector = `${mainBlockSelector} [data-apos-add-content]`;
      const mixedWidgetBtnSelector = `${mainBlockSelector} [data-apos-add-item=mixed]`;
      const modalDialogSelector = '.apos-modal.apos-modal-slideable';
      const browseBtnSelector = '[data-apos-browse]';
      const articleCheckboxSelector = '.apos-manage-table tr[data-piece] .apos-field-input-checkbox-indicator:first';
      const productCheckboxSelector = '.apos-manage-table tr[data-piece] .apos-field-input-checkbox-indicator:first';
      const regressionTestPageCheckboxSelector = '[data-apos-reorganize-depth="2"] input[type="checkbox"]:first';
      // const busyLayerSelector = '.apos-global-busy.active';
      // const saveChoicesBtnSelector = '[data-apos-modal-depth="1"] [data-apos-save]';
      // const saveBlogBtnSelector = '[data-apos-modal-depth="0"] [data-apos-save]';
      // const blogArticleTitleSelector = '.blog-card-title-container';

      client.waitForElementVisible(addContentBtnSelector);
      client.click(addContentBtnSelector);
      client.waitForElementVisible(mixedWidgetBtnSelector);
      client.click(mixedWidgetBtnSelector);
      client.waitForElementVisible(modalDialogSelector);
      client.waitForElementVisible(browseBtnSelector);
      client.click(browseBtnSelector);
      client.waitForElementVisible(articleCheckboxSelector);
      client.click(articleCheckboxSelector);
      client.click('[data-tab-button="product"]');
      client.click(productCheckboxSelector);
      client.click('[data-tab-button="apostrophe-page"]');
      client.waitForElementVisible(regressionTestPageCheckboxSelector);
      client.click(regressionTestPageCheckboxSelector);
      // client.waitForElementVisible(saveChoicesBtnSelector);
      // client.click(saveChoicesBtnSelector);
      // client.waitForElementVisible(saveBlogBtnSelector);
      // client.click(saveBlogBtnSelector);
      // client.useCss();    }
    }
  }
);
