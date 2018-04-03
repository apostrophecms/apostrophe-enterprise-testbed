let counter = 0;

function castTwoDigits(val) {
  return ('0' + val).slice(-2);
}

module.exports = (articleName) => {
  counter++;

  return {
    [`[${counter}] create an article`]: function(client) {
      const menuBtnSelector = '[data-apos-actionable=data-apos-admin-bar]';
      const workflowXPathSelector = '(//*[contains(@class, "apos-admin-bar-item-inner")])[8]';
      const modalBlogSelector = '.apostrophe-blog-manager';
      const addArticleBtnSelector = '[data-apos-create-apostrophe-blog]';
      const basicsBodySelector = '[data-apos-group=basic]';
      const metaBodySelector = '[data-apos-group=meta]';
      const infoBodySelector = '[data-apos-group=default]';
      const inputTitleSelector = '.apos-field-title input';
      const inputPublishedSelector = '.apos-field-published select';
      const inputPublicationDateSelector = '.apos-field-date input';
      const metaTabSelector = '[data-apos-open-group=meta]';
      const infoTabSelector = '[data-apos-open-group=default]';
      const saveBtnSelector = '[data-apos-save]';
      const manageTableRowSelector = '.apos-manage-table tr[data-piece]';

      client.click(menuBtnSelector);
      client.click(menuBtnSelector);
      client.useXpath();
      client.click(workflowXPathSelector);
      client.useCss();
      client.waitForElementVisible(modalBlogSelector);
      client.pause(200);
      client.click(addArticleBtnSelector);
      client.waitForElementVisible(basicsBodySelector);
      client.setValue(inputTitleSelector, articleName);
      client.click(metaTabSelector);
      client.waitForElementVisible(metaBodySelector);
      client.setValue(inputPublishedSelector, 'Yes');
      client.click(infoTabSelector);
      client.waitForElementVisible(infoBodySelector);

      const currentDate = new Date();
      const day = castTwoDigits(currentDate.getDate());
      const month = castTwoDigits(currentDate.getMonth()+1);
      const year = currentDate.getFullYear();
      const publicationDate = `${year}-${month}-${day}`;

      client.setValue(inputPublicationDateSelector, publicationDate);
      client.click(saveBtnSelector);
      client.waitForElementVisible(modalBlogSelector);

      client.expect.element(manageTableRowSelector).text.to.contain(articleName);
      client.expect.element(manageTableRowSelector).text.to.contain('Published');
      client.expect.element(manageTableRowSelector).text.to.contain(publicationDate);
    }
  };
};
