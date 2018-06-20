let counter = 0;

module.exports = (pageName) => {
  counter++;

  return {
    [`[${counter}] make subpage "${pageName}"`]: function(client) {
      const pageMenuBtnSelector = '.apos-context-menu .apos-button';
      const pageMenuDropdownSelector = '.apos-context-menu .apos-dropdown-items';
      const pageMenuCreatePageSelector = '.apos-context-menu .apos-dropdown-items .apos-dropdown-item:first-child';

      client.clickWhenReady(pageMenuBtnSelector);
      client.waitForElementReady(pageMenuDropdownSelector);
      client.clickWhenReady(pageMenuCreatePageSelector);
      client.resetValueInModal('apostrophe-pages-editor', '[name="title"]', pageName);
      client.clickInModal('apostrophe-pages-editor', '[data-apos-save]');
    }
  };
};
