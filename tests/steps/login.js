module.exports = {
  'login step': function(client) {
    client.click('.demo-login-button a');
    client.setValue('.apos-login-username input', 'admin');
    client.setValue('.apos-login-password input', 'demo');
    client.click('.apos-login-submit input');

    client.expect.element('body.apos-workflow-live-page').to.be.present;
  }
};
