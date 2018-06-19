let counter = 0;

module.exports = (locale, doExport) => {
  counter++;

  return {
    [`[${counter}] switch locale to "${locale}"`]: function(client) {
      const localeSwitcherBtnSelector = 'a[data-apos-admin-bar-item=apostrophe-workflow-locale-picker-modal]';
      const requiredLocaleBtnSelector = `a[data-apos-locale=${locale}]`;
      client.waitForElementVisible(localeSwitcherBtnSelector);
      client.click(localeSwitcherBtnSelector);
      client.waitForElementVisible(requiredLocaleBtnSelector);
      client.click(requiredLocaleBtnSelector);

      // sometimes we need to exort the article before we can switch locale
      if (doExport) {
        client.waitForElementVisible('[data-apos-save]');
        client.click('[data-apos-save]');
      } else {
        const labelSelector = `${localeSwitcherBtnSelector} .apos-button-label`;
        client.expect.element(labelSelector).text.to.contain(locale).before(60000);
        client.assert.urlContains(locale);
      }
    }
  };
};
