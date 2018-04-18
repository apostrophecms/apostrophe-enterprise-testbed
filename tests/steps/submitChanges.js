let counter = 0;

module.exports = () => {
  counter++;

  return {
    [`[${counter}] submit changes`]: function(client) {
      const submitBtnSelector = '[data-apos-workflow-submit]';
      const submittedLabelSelector = '[data-apos-workflow-submitted]';
      const notiSelector = '.apos-notification-container';

      client.pause(1000);
      client.waitForElementVisible(submitBtnSelector);
      client.pause(200);
      client.click(submitBtnSelector);
      client.waitForElementVisible(notiSelector, 15000);
      client.click(notiSelector);
      client.waitForElementNotVisible(notiSelector);
      client.waitForElementVisible(submittedLabelSelector);
    }
  };
};
