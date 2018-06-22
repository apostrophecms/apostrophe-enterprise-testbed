exports.command = function waitForElementReady(selector) {  
  return this
  .waitForElementNotPresent('.apos-busy,.apos-global-busy')
  .waitForElementVisible(selector);
};