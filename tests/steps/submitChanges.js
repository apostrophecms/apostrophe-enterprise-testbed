let counter = 0;

module.exports = () => {
  counter++;

  return {
    [`[${counter}] submit changes`]: function(client) {
      const submitBtnSelector = '[data-apos-workflow-submit]';
      const submittedLabelSelector = '[data-apos-workflow-submitted]';
      const notiSelector = '.apos-notification-container';

      client.waitForElementVisible(submitBtnSelector);
      client.click(submitBtnSelector);
      client.waitForElementVisible(notiSelector);
      client.click(notiSelector);
      client.waitForElementNotVisible(notiSelector);
      client.waitForElementVisible(submittedLabelSelector);
    }
  };
};
