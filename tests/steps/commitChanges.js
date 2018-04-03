let counter = 0;

module.exports = (itemsCount = 1) => {
  counter++;

  return {
    [`[${counter}] commit all changes`]: function(client) {
      // TODO: commit specified times

      const commitBtnSelector = '[data-apos-workflow-commit]';
      const modalDialogSelector = '.apos-workflow-commit-modal';
      const confirmBtnSelector = `${modalDialogSelector} [data-apos-save]`;
      const exportBtnSelector = '.apos-workflow-export-modal [data-apos-save]';
      const masterLocaleBtnSelector = '[for*=master] span';

      client.pause(200);
      client.waitForElementVisible(commitBtnSelector);
      client.click(commitBtnSelector);

      for (let i = 0; i < itemsCount; i++) {
        client.pause(1000);
        client.waitForElementVisible(modalDialogSelector);
        client.waitForElementVisible(confirmBtnSelector);
        client.click(confirmBtnSelector);

        // APOS store information about selected locales,
        // so that we must du not once
        if (i === 0) {
          client.waitForElementVisible(masterLocaleBtnSelector);
          client.click(masterLocaleBtnSelector);
        }

        client.waitForElementVisible(exportBtnSelector);
        client.click(exportBtnSelector);
      }
      // TODO: we can capture and see messages about commiting and exporting
      // but modal dialog is visible
      client.waitForElementNotPresent(modalDialogSelector);
    }
  };
};
