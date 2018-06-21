let counter = 0;

module.exports = (documentNames) => {
  counter++;

  return {
    [`[${counter}] check submitted`]: function(client) {
      client.openAdminBarItem('apostrophe-workflow-manage-modal');
      const listItemsSelector = '.apos-table [data-list]';
      client.waitForModal('apostrophe-workflow-manage-modal');
      documentNames.forEach((name) => {
        client.expect.element(listItemsSelector).text.to.contain(name);
      });
      client.clickInModal('apostrophe-workflow-manage-modal', '[data-apos-cancel]');
    }
  };
};
