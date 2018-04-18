let counter = 0;

module.exports = () => {
  counter++;

  return {
    [`[${counter}] submit changes`]: function(client) {
      const submitBtnSelector = '[data-apos-workflow-submit]';
      const submittedLabelSelector = '[data-apos-workflow-submitted]';
      const notiSelector = '.apos-notification-container';

      // Timed out while waiting for element <[data-apos-workflow-submit]>
      // to be visible for 5000 milliseconds.  - expected "visible" but got: "not visible"
      client.pause(1000);
      client.saveScreenshot('./look-at-me.png');
      client.waitForElementVisible(submitBtnSelector);
      client.pause(200);
      client.click(submitBtnSelector);

      // Timed out while waiting for element <.apos-notification-container>
      // to be visible for 5000 milliseconds.  - expected "visible" but got: "not visible"
      client.waitForElementVisible(notiSelector, 15000);
      client.click(notiSelector);
      client.waitForElementNotVisible(notiSelector);
      client.waitForElementVisible(submittedLabelSelector);
    }
  };
};
