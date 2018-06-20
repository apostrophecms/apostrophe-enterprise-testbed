// Reset a value in a modal once it becomes available, replacing
// any previous value.
//
// `modal` is the moog type name, i.e. apostrophe-groups-manager-modal,
// apostrophe-users-editor-modal, etc.
//
// This method will wait until the current active modal is of the specified
// type and the element is visible within it, with the default timeout.
//
// `selector` should not and cannot try to detect the modal itself, it is
// a sub-selector within the modal.

exports.command = function resetValueInModal(modal, selector, value) {
  selector = '[data-apos-modal-current="' + modal + '"] ' + selector;
  return this
    .waitForElementVisible(selector)
    .clearValue(selector)
    .setValue(selector, value);
};
