exports.command = function waitForElementReady(selector) {  
  return this
    .waitForElementVisible(selector)
    .waitForElementNotPresent('.apos-busy,.apos-global-busy');
};