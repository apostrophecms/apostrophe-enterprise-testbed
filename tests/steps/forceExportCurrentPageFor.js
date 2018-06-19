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

      client.clickWhenReady(menuBtnSelector);
      client.waitForElementReady(menuItemsSelector);
      client.clickWhenReady(forceExportBtnSelector);
      client.waitForElementReady(modalDialogSelector);
      client.pause(1000);
      client.clickWhenReady(workflowMenuBtnSelector);
      client.waitForElementReady(workflowMenuItemsSelector);
      client.clickWhenReady(workflowForceExportBtnSelector);
      client.waitForElementReady(modalDialogExportSelector);
      client.clickWhenReady(localeInputSelector);
      client.clickWhenReady(confirmExportBtnSelector);
      client.waitForElementNotPresent(modalDialogExportSelector);
    }
  };
};
