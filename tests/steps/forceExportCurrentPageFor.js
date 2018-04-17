let counter = 0;

module.exports = (locale) => {
  counter++;

  return {
    [`[${counter}] force export current page for ${locale}`]: function(client) {
      const menuBtnSelector = '.apos-context-menu [data-apos-dropdown-button-label]';
      const menuItemsSelector = '.apos-context-menu .apos-dropdown-items';
      const forceExportBtnSelector = '.apos-context-menu [data-apos-update-page]';
      const modalDialogSelector = '.apos-modal-slideable';
      const workflowMenuBtnSelector = '.apos-modal-slideable [data-apos-dropdown-button-label]';
      const workflowMenuItemsSelector = '.apos-modal-slideable .apos-dropdown-items';
      const workflowForceExportBtnSelector = '[data-apos-workflow-force-export]';
      const modalDialogExportSelector = '.apos-workflow-export-modal';
      const localeInputSelector = `input[id="locales[${locale}]"]`;
      const confirmExportBtnSelector = '.apos-workflow-export-modal [data-apos-save]';

      client.click(menuBtnSelector);
      client.waitForElementVisible(menuItemsSelector);
      client.click(forceExportBtnSelector);
      // Timed out while waiting for element <.apos-modal-slideable> to be
      // present for 5000 milliseconds.  - expected "visible" but got: "not found"
      client.waitForElementVisible(modalDialogSelector);
      client.pause(1000);
      client.click(workflowMenuBtnSelector);
      client.waitForElementVisible(workflowMenuItemsSelector);
      client.click(workflowForceExportBtnSelector);
      client.waitForElementVisible(modalDialogExportSelector);
      client.click(localeInputSelector);
      client.click(confirmExportBtnSelector);
      client.waitForElementNotPresent(modalDialogExportSelector);
    }
  };
};
