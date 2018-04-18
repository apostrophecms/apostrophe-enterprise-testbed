let counter = 0;

module.exports = (type) => {
  counter++;

  return {
    [`[${counter}] change page type to ${type}`]: function(client) {
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
      // Timed out while waiting for element <.apos-modal.apos-modal-slideable>
      // to be present for 5000 milliseconds.  - expected "visible" but got: "not found"
      client.pause(5000);
      client.saveScreenshot('./look-at-me.png');

      client.waitForElementVisible(modalDialogSelector);
      client.useXpath();
      client.setValue(selectTypeSelector, type);
      client.useCss();

      client.saveScreenshot('./look-at-me.png');
      // ✖ Timed out while waiting for element <.apos-global-busy.active> to be removed for 5000 milliseconds.
      // - expected "not found" but got: "found"
      client.waitForElementNotPresent(busyLayerSelector, 15000);
      client.pause(1000);
      client.click(saveBtnSelector);
      client.waitForElementNotPresent(blackoutSelector);

      client.expect.element(demoHeaderSelector).text.to.contain(`You are on the "${type}" template`);
    }
  };
};
