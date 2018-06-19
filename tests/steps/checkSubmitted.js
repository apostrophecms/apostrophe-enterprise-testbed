let counter = 0;

module.exports = (documentNames) => {
  counter++;

  return {
    [`[${counter}] check submited`]: function(client) {
      const openedMenuSelector = '.apos-admin-bar.apos-active';
      const submissionsBtnSelector = '[data-apos-admin-bar-item=apostrophe-workflow-manage-modal]';
      const subMenuSelector = '.apos-dropdown--admin.apos-active';
      const doneBtnSelector = '[data-apos-cancel]';
      const listItemsSelector = '.apos-table [data-list]';
      const modalDialogSelector = '.apos-workflow-submit-modal';

      client.execute(function() {
        if ($('.apos-admin-bar.apos-active').length === 0) {
          $('[data-apos-actionable=data-apos-admin-bar]').click();
        }
      });
      client.waitForElementPresent(openedMenuSelector);
      client.execute(function() {
        setTimeout(function() {
          $(".apos-admin-bar-item-inner:contains(Workflow)").click();
        }, 300);
      });
      client.waitForElementPresent(subMenuSelector);
      client.clickWhenReady(submissionsBtnSelector);
      client.waitForElementPresent(modalDialogSelector);

      documentNames.forEach((name) => {
        client.expect.element(listItemsSelector).text.to.contain(name);
      });

      client.clickWhenReady(doneBtnSelector);
    }
  };
};
