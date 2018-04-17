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

  client.execute(function(a) {
    $("[data-apos-actionable=data-apos-admin-bar]").click();

    setTimeout(function() {
      if ($(".apos-admin-bar.apos-active").length === 0) {
        $("[data-apos-actionable=data-apos-admin-bar]").click();
      }
    }, 5000);
  });

  client.waitForElementPresent(openedMenuSelector, 9000);
}
