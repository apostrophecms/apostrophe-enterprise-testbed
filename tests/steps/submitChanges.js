let counter = 0;

module.exports = () => {
  counter++;

  return {
    [`[${counter}] submit changes`]: function(client) {
      const submitBtnSelector = '[data-apos-workflow-submit]';
      const submittedLabelSelector = '[data-apos-workflow-submitted]';
      const notiSelector = '.apos-notification-container';

      client.pause(10000);
      client.waitForElementReady(submitBtnSelector);
      client.pause(1000);
      client.clickWhenReady(submitBtnSelector);
      client.waitForElementReady(notiSelector);
      client.clickWhenReady(notiSelector);
      client.waitForElementNotVisible(notiSelector);
      client.waitForElementReady(submittedLabelSelector);
    }
  };
};
