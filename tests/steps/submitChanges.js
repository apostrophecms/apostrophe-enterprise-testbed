let counter = 0;

module.exports = () => {
  counter++;

  return {
    [`[${counter}] submit changes`]: function(client) {
      const submitBtnSelector = '[data-apos-workflow-submit]';
      const submittedLabelSelector = '[data-apos-workflow-submitted]';

      client.click('body');
      client.click(submitBtnSelector);
      client.click(submitBtnSelector);
      client.waitForElementVisible(submittedLabelSelector, 2000);
    }
  };
};
