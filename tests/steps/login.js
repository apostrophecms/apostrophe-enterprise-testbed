let counter = 0;

module.exports = () => {
  counter++;

  return {
    [`[${counter}] login step`]: function(client) {
      const loginBtnSelector = '.demo-login-button a';
      const usernameInputSelector = '.apos-login-username input';
      const passInputSelector = '.apos-login-password input';
      const submitBtnSelector = '.apos-login-submit input';

      client.clickWhenReady(loginBtnSelector);
      client.waitForElementReady(usernameInputSelector);
      client.setValue(usernameInputSelector, 'admin');
      client.setValue(passInputSelector, 'demo');
      client.clickWhenReady(submitBtnSelector);

      const loggedInPageSelector = 'body.apos-workflow-live-page';

      client.expect.element(loggedInPageSelector).to.be.present;
    }
  };
};
