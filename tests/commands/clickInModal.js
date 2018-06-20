// Click a button in a modal once it becomes available.
//
// `modal` is the moog type name, i.e. apostrophe-groups-manager-modal,
// apostrophe-users-editor-modal, etc.
//
// This method will wait until the current active modal is of the specified
// type and the element is visible within it, with the default timeout,
// and there are no apos-busy or apos-global-busy states in play.
//
// `selector` should not and cannot try to detect the modal itself, it is
// a sub-selector within the modal.

exports.command = function clickInModal(modal, selector) {
  selector = '[data-apos-modal-current="' + modal + '"] ' + selector;
  return this
    .waitForElementReady(selector)
    .click(selector);
};
