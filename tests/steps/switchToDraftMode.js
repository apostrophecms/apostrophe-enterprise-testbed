let counter = 0;

module.exports = () => {
  counter++;

  return {
    [`[${counter}] switch mode to "draft"`]: function(client) {
      const modeSwitcherBtnSelector = '.apos-dropdown--button.apos-workflow-state';
      const requiredModeBtnSelector = `li[data-apos-workflow-mode=draft]`;
      const listItemToBeChangedSelector = 'li[data-apos-workflow-mode=live]';

      client.pause(200);
      client.clickWhenReady(modeSwitcherBtnSelector);
      client.clickWhenReady(requiredModeBtnSelector);
      client.waitForElementPresent(listItemToBeChangedSelector);

      const labelSelector = '.apos-dropdown--button.apos-workflow-state .apos-button-label';

      client.expect.element(labelSelector).text.to.contain('Draft');
    }
  };
};
