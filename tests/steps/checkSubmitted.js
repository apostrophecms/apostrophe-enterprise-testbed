let counter = 0;

module.exports = (documentName) => {
  counter++;

  return {
    [`[${counter}] check submited item "${documentName}"`]: function(client) {
      const menuBtnSelector = '[data-apos-actionable=data-apos-admin-bar]';
      const workflowXPathSelector = '(//*[contains(@class, "apos-admin-bar-item-inner")])[9]';
      const submissionsBtnSelector = '[data-apos-admin-bar-item=apostrophe-workflow-manage-modal]';
      const doneBtnSelector = '[data-apos-cancel]';

      client.click(menuBtnSelector);
      client.click(menuBtnSelector);
      client.useXpath();
      client.click(workflowXPathSelector);
      client.useCss();
      client.click(submissionsBtnSelector);
      client.click(submissionsBtnSelector);

      client.expect.element('.apos-table [data-list]').text.to.contain(documentName).before(1000);

      client.click(doneBtnSelector);
    }
  };
};
