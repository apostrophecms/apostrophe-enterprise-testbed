let counter = 0;

module.exports = (text) => {
  counter++;

  return {
    [`[${counter}] check notification`]: function(client) {
      const notificationSelector = '.apos-notification-container';

      client.waitForElementReady(notificationSelector);
      client.expect.element(notificationSelector).text.to.equal(text).before(0);
    }
  };
};
