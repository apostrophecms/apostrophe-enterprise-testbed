module.exports = (locale) => ({
  [`switch local to "${locale}"`]: function(client) {
    const localeSwitcherBtnSelector = 'a[data-apos-admin-bar-item=apostrophe-workflow-locale-picker-modal]';
    const modalDialogSelector = '.apos-workflow-locale-picker-modal';
    const requiredLocaleBtnSelector = `a[data-apos-locale=${locale}]`;

    client.click(localeSwitcherBtnSelector);
    client.waitForElementVisible(modalDialogSelector, 1000);
    client.click(requiredLocaleBtnSelector);

    const labelSelector = `${localeSwitcherBtnSelector} .apos-button-label`;

    client.assert.urlContains(locale);
    client.expect.element(labelSelector).text.to.contain(locale);
  }
});
