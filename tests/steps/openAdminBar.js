let counter = 0;

module.exports = () => {
  counter++;

  return {
    [`[${counter}] open admin bar`]: method,
  };
};
module.exports.method = method;

function method(client) {
  const btnMenuSelector = '[data-apos-actionable=data-apos-admin-bar]';
  const openedMenuSelector = '.apos-admin-bar.apos-active';

  client.isVisible(openedMenuSelector, (result) => {
    if (!result.value) {
      client.click(btnMenuSelector);
    }
  });
  client.waitForElementPresent(openedMenuSelector, 9000);
}
