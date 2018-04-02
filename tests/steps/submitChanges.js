let counter = 0;

module.exports = () => {
  counter++;

  return {
    [`[${counter}] submit changes`]: function(client) {
      const submitBtnSelector = '[data-apos-workflow-submit]';
      const submittedLabelSelector = '[data-apos-workflow-submitted]';
      const notiSelector = '.apos-notification-container';

      client.waitForElementVisible(submitBtnSelector, 5000);
      client.click(submitBtnSelector);
      client.waitForElementVisible(notiSelector, 5000);
      client.click(notiSelector);
      client.waitForElementNotVisible(notiSelector, 5000);
      client.waitForElementVisible(submittedLabelSelector, 5000);
    }
  };
};
