exports.command = function waitForElementReady(selector) {  
  return this
    .waitForElementReady(selector)
    .click(selector);
};
