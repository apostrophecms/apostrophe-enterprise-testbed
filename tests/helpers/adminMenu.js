module.exports.open = function (client) {
  const menuBtnXPathSelector = '//div[@data-apos-actionable="data-apos-admin-bar"]';
  const tagXPathSelector = '(//*[contains(@class, "apos-admin-bar-item-inner")])[8]';

  client.useXpath();
  client.isVisible(tagXPathSelector, (result) => {
    if (!result.value) {
      client.click(menuBtnXPathSelector);
    }
  });
  client.useCss();
};
