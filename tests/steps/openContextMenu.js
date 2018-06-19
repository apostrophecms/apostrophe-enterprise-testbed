let counter = 0;

module.exports = (menuItemText) => {
  counter++;

  return {
    [`[${counter}] open context menu`]: function(client) {
      const menuBtnSelector = '.apos-context-menu [data-apos-dropdown-button-label]';
      const menuItemsSelector = '.apos-context-menu .apos-dropdown-items';
      const specifiedMenuItemSelector = `.apos-context-menu .apos-dropdown-items li:contains(${menuItemText})`;
      const modalDialogSelector = '.apos-modal';

      client.clickWhenReady(menuBtnSelector);
      client.waitForElementReady(menuItemsSelector);
      client.execute(function(selector) {
        $(selector).click();
      }, [specifiedMenuItemSelector]);
      client.waitForElementReady(modalDialogSelector);
    }
  };
};
