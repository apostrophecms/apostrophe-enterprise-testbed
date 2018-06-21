let counter = 0;

module.exports = () => {
  counter++;

  return {
    [`[${counter}] submit changes`]: function(client) {
      const submitBtnSelector = '[data-apos-workflow-submit]';
      const submittedLabelSelector = '[data-apos-workflow-submitted]';
      const notiSelector = '.apos-notification-container';

      client.clickWhenReady(submitBtnSelector);
      client.clickWhenReady(notiSelector);
      client.waitForElementNotVisible(notiSelector);
      client.waitForElementReady(submittedLabelSelector);
    }
  };
};
