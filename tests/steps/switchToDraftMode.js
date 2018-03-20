module.exports = {
  'switch mode to "draft"': function(client) {
    const modeSwithcerBtnSelector = '.apos-dropdown--button.apos-workflow-state';
    const requiredModeBtnSelector = `li[data-apos-workflow-mode=draft]`;
    const listItemToBeChangedSelector = 'li[data-apos-workflow-mode=live]';

    client.click(modeSwithcerBtnSelector);
    client.click(requiredModeBtnSelector);
    client.waitForElementPresent(listItemToBeChangedSelector, 2000);

    const labelSelector = '.apos-dropdown--button.apos-workflow-state .apos-button-label';

    client.expect.element(labelSelector).text.to.contain('Draft');
  }
};
