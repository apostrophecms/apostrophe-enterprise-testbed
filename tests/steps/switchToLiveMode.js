let counter = 0;

module.exports = () => {
  counter++;

  return {
    [`[${counter}] switch mode to "live"`]: function(client) {
      const modeSwithcerBtnSelector = '.apos-dropdown--button.apos-workflow-state';
      const requiredModeBtnSelector = `li[data-apos-workflow-mode=live]`;
      const listItemToBeChangedSelector = 'li[data-apos-workflow-mode=draft]';

      client.pause(200);
      client.clickWhenReady(modeSwithcerBtnSelector);
      client.clickWhenReady(requiredModeBtnSelector);
      client.waitForElementPresent(listItemToBeChangedSelector);

      const labelSelector = '.apos-dropdown--button.apos-workflow-state .apos-button-label';

      client.expect.element(labelSelector).text.to.contain('Live');
    }
  };
};
