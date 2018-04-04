const server = require('../server');
const steps = require('../steps');

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
  steps.submitChanges(),
  steps.checkSubmitted(['Regression test']),
  steps.switchToLiveMode(),
  steps.confirm404ByRelativeUrl('regression-test'),
  steps.switchToDraftMode(),
  steps.navigateToPage('regression-test'),
  steps.commitAndExport(),
  steps.navigateToHome(),
  steps.switchToLiveMode(),
  steps.confirm200ByRelativeUrl('regression-test'),
  steps.switchToDraftMode(),
  steps.navigateToPage('regression-test'),
  {
    'change page type to "alternate"': (client) => {
      const pageMenuBtnSelector = '.apos-context-menu .apos-button';
      const pageSettingsSelector = '[data-apos-update-page]';
      const modalDialogSelector = '.apos-modal.apos-modal-slideable';
      const selectTypeSelector = '//div[@class="apos-schema-group-inner"]/fieldset[@data-name="type"]/div/select';
      const saveBtnSelector = '[data-apos-save]';
      const blackoutSelector = '.apos-modal-blackout';
      const demoHeaderSelector = '.demo-header h5';
      const busyLayerSelector = '.apos-global-busy.active';

      client.click(pageMenuBtnSelector);
      client.waitForElementVisible(pageSettingsSelector);
      client.click(pageSettingsSelector);
      client.waitForElementVisible(modalDialogSelector);
      client.useXpath();
      client.setValue(selectTypeSelector, 'Alternate Page');
      client.useCss();
      client.waitForElementNotPresent(busyLayerSelector);
      client.pause(200);
      client.click(saveBtnSelector);
      client.waitForElementNotPresent(blackoutSelector);

      client.expect.element(demoHeaderSelector).text.to.contain('You are on the "Alternate Page" template');
    }
  }
);
