const server = require('apostrophe-nightwatch-tools/server');
const steps = require('apostrophe-nightwatch-tools/steps');

const mainBlockSelector = '.demo-main';
const addContentBtnSelector = `${mainBlockSelector} [data-apos-add-content]`;
const productsWidgetBtnSelector = `${mainBlockSelector} [data-apos-add-item=products]`;
const modalDynamicStyleSelector = '[data-name="styleDynamic"] select[name="styleDynamic"]';
const productsWidgetSelector = '[data-apos-widget="products"]';
const widgetUiSelector = '[data-dot-path="main"] [data-apos-widget-controls] [data-apos-edit-item]';
const productsWidgetModalName = 'products-widgets-editor';
const dynamicStyleWidgetControlSelector = '[data-schema-widget-control-label="Style Dynamic"]';
const dynamicColorsWidgetControlSelector = '[data-schema-widget-control-label="Colors Dynamic"]';

module.exports = Object.assign(
  {
    before: (client, done) => {
      client.resizeWindow(1200, 800);
      if (!this._server) {
        this._server = server.create('localhost', 3111);
        this._server.start(done);
      }
    },
    after: (client, done) => {
      client.end(() => {
        this._server.stop(done);
      });
    }
  },
  steps.main(),
  steps.login(),
  steps.switchToDraftMode(),
  steps.makeSubPage('Regression test'),
  {
    'Update dynamic fields in a products widget': (client) => {
      client.waitForElementReady(addContentBtnSelector);
      client.click(addContentBtnSelector);
      client.waitForElementReady(productsWidgetBtnSelector);
      // Select a dynamic style.
      client.click(productsWidgetBtnSelector);
      client.resetValueInModal(productsWidgetModalName, modalDynamicStyleSelector, 'Intrepid');
      // Select some dynamic colors.
      client.clickInModal(productsWidgetModalName, '[name="colorsDynamic"][value="purple"] + .apos-form-checkbox-indicator');
      client.clickInModal(productsWidgetModalName, '[name="colorsDynamic"][value="silver"] + .apos-form-checkbox-indicator');
      client.pause(2000);
      client.clickInModal(productsWidgetModalName, '[data-apos-save]');
      client.waitForNoModals();
      // Move over the widget and reopen the modal to check saved values.
      client.moveToElement(productsWidgetSelector, 5, 5);
      client.waitForElementVisible(widgetUiSelector);
      client.click(widgetUiSelector);
      client.waitForModal(productsWidgetModalName);
      // Check the values
      client.expect.element(modalDynamicStyleSelector).to.have.value.that.equals('intrepid');
      client.expect.element('[name="colorsDynamic"][value="silver"]').to.be.selected;
      client.expect.element('[name="colorsDynamic"][value="purple"]').to.be.selected;
      client.expect.element('[name="colorsDynamic"][value="yellow"]').to.not.be.selected;
      client.clickInModal(productsWidgetModalName, '[data-apos-cancel]');
      // Check the values in the widget controls UI.
      client.moveToElement(productsWidgetSelector, 5, 5);
      client.expect.element(dynamicStyleWidgetControlSelector).to.have.value.that.equals('intrepid');
      client.expect.element(`${dynamicColorsWidgetControlSelector} option[value="__current"]`).text.to.equal('Purple, Silver');
      // Change the values in the widget controls UI.
      client.click(`${dynamicStyleWidgetControlSelector} [value="hideous"]`);
      client.clickWhenReady(`${dynamicColorsWidgetControlSelector} [value="- silver"]`);
      client.clickWhenReady(`${dynamicColorsWidgetControlSelector} [value="+ yellow"]`);
      client.pause(3000);
      // Check the values in the modal this time.
      client.click(widgetUiSelector);
      client.waitForModal(productsWidgetModalName);
      client.expect.element(modalDynamicStyleSelector).to.have.value.that.equals('hideous');
      client.expect.element('[name="colorsDynamic"][value="silver"]').to.not.be.selected;
      client.expect.element('[name="colorsDynamic"][value="purple"]').to.be.selected;
      client.expect.element('[name="colorsDynamic"][value="yellow"]').to.be.selected;
    }
  }
);
