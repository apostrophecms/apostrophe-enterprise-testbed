
// `modal` is the moog type name, i.e. apostrophe-groups-manager-modal,
// apostrophe-users-editor-modal, etc.
//
// This method will wait until the current active modal is of the specified
// type and is visible, and there are no apos-busy or apos-global-busy states in play.

exports.command = function waitForModal(modal) {
  selector = '[data-apos-modal-current="' + modal + '"]';
  return this
    .waitForElementReady(selector);
};
