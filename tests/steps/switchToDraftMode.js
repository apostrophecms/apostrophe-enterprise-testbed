module.exports = {
  'switch mode to "draft"': function(client) {
    client.click('.apos-dropdown--button.apos-workflow-state');
    client.click(`li[data-apos-workflow-mode=draft]`);
    client.waitForElementPresent('li[data-apos-workflow-mode=live]', 2000);

    client.expect
      .element('.apos-dropdown--button.apos-workflow-state .apos-button-label')
      .text.to.contain('Draft');
  }
};
