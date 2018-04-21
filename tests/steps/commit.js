let counter = 0;

module.exports = (itemsCount = 1) => {
  counter++;

  return {
    [`[${counter}] commit all changes`]: function(client) {
      const commitBtnSelector = '[data-apos-workflow-commit]';
      const skipExportBtnSelector = '.apos-workflow-export-modal [data-apos-cancel]';
      const modalDialogSelector = '.apos-workflow-commit-modal';
      const confirmBtnSelector = `${modalDialogSelector} [data-apos-save]`;

      client.pause(200);
      client.waitForElementVisible(commitBtnSelector);
      client.click(commitBtnSelector);

      for (let i = 0; i < itemsCount; i++) {
        client.pause(1000);
        client.waitForElementVisible(modalDialogSelector);
        client.waitForElementVisible(confirmBtnSelector);
        client.click(confirmBtnSelector);
        client.pause(200);
        client.waitForElementVisible(skipExportBtnSelector);
        client.click(skipExportBtnSelector);
      }

      client.waitForElementNotPresent(modalDialogSelector);
    }
  };
};
