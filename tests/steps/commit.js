let counter = 0;

module.exports = (itemsCount = 1) => {
  counter++;

  return {
    [`[${counter}] commit all changes`]: function(client) {
      const commitBtnSelector = '[data-apos-workflow-commit]';
      const skipExportBtnSelector = '.apos-workflow-export-modal [data-apos-cancel]';
      const modalDialogSelector = '.apos-workflow-commit-modal';
      const confirmBtnSelector = `${modalDialogSelector} [data-apos-save]`;

      client.waitForElementReady(commitBtnSelector);
      client.clickWhenReady(commitBtnSelector);

      for (let i = 0; i < itemsCount; i++) {
        client.clickInModal('apostrophe-workflow-commit-modal', '[data-apos-save]');
        client.clickInModal('apostrophe-workflow-export-modal', '[data-apos-cancel]');
      }

      client.waitForNoModals();
    }
  };
};
