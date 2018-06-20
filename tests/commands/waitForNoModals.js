// Wait for no modals to be in play.

exports.command = function waitForNoModals() {
  var blackoutSelector = '.apos-modal-blackout,.apos-modal';
  return this.waitForElementNotPresent(blackoutSelector);
};
