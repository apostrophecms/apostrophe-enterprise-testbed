const openAdminBar = require('./openAdminBar');

let counter = 0;

function castTwoDigits(val) {
  return ('0' + val).slice(-2);
}

module.exports = (articleName) => {
  counter++;

  return {
    [`[${counter}] create an article`]: function(client) {
      const blackoutSelector = '.apos-modal-blackout';
      const articleSelector = '[data-apos-admin-bar-item="apostrophe-blog"]';
      const modalBlogSelector = '.apostrophe-blog-manager';
      const addArticleBtnSelector = '[data-apos-create-apostrophe-blog]';
      const basicsBodySelector = '[data-apos-group=basic]';
      const metaBodySelector = '[data-apos-group=meta]';
      const infoBodySelector = '[data-apos-group=default]';
      const inputTitleSelector = '.apos-field-title input';
      const selectPublishedSelector = '.apos-field-published select';
      const inputPublicationDateSelector = '.apos-field-date input';
      const metaTabSelector = '[data-apos-open-group=meta]';
      const infoTabSelector = '[data-apos-open-group=default]';
      const saveBtnSelector = '[data-apos-save]';
      const manageTableRowSelector = '.apos-manage-table tr[data-piece]';

      client.waitForElementNotPresent(blackoutSelector);
      openAdminBar.method(client);
      client.waitForElementVisible(articleSelector);
      client.click(articleSelector);
      client.useCss();
      client.waitForElementVisible(modalBlogSelector);
      client.pause(200);
      client.click(addArticleBtnSelector);
      client.waitForElementVisible(basicsBodySelector);
      client.setValue(inputTitleSelector, articleName);
      client.click(metaTabSelector);
      client.waitForElementVisible(metaBodySelector);
      client.setValue(selectPublishedSelector, 'Yes');
      client.click(infoTabSelector);
      client.waitForElementVisible(infoBodySelector);

      const currentDate = new Date();
      const day = castTwoDigits(currentDate.getDate());
      const month = castTwoDigits(currentDate.getMonth()+1);
      const year = currentDate.getFullYear();
      const publicationDate = `${year}-${month}-${day}`;

      client.setValue(inputPublicationDateSelector, publicationDate);
      client.click(saveBtnSelector);
      client.waitForElementNotPresent(blackoutSelector);
      client.waitForElementVisible(articleSelector);
      client.click(articleSelector);
      client.waitForElementVisible(manageTableRowSelector);
      client.expect.element(manageTableRowSelector).text.to.contain(articleName);
      client.expect.element(manageTableRowSelector).text.to.contain('Published');
      client.expect.element(manageTableRowSelector).text.to.contain(publicationDate);
    }
  };
};
