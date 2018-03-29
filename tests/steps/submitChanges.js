let counter = 0;

module.exports = () => {
  counter++;

  return {
    [`[${counter}] submit changes`]: function(client) {
      const submitBtnSelector = '[data-apos-workflow-submit]';
      const submittedLabelSelector = '[data-apos-workflow-submitted]';

      client.pause(200);
      client.click(submitBtnSelector);
      client.click(submitBtnSelector);
      client.waitForElementVisible(submittedLabelSelector, 5000);
    }
  };
};
