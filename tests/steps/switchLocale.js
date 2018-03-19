module.exports = (locale) => ({
  [`switch local to "${locale}"`]: function(client) {
    client.click('a[data-apos-admin-bar-item=apostrophe-workflow-locale-picker-modal]');
    client.waitForElementVisible('.apos-workflow-locale-picker-modal', 1000);
    client.click(`a[data-apos-locale=${locale}]`);

    client.assert.urlContains(locale);
    client.expect
      .element('a[data-apos-admin-bar-item=apostrophe-workflow-locale-picker-modal] .apos-button-label')
      .text.to.contain(locale);
  }
});
