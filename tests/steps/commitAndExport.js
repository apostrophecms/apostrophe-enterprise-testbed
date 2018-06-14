let counter = 0;

module.exports = (itemsCount = 1) => {
  counter++;

  return {
    [`[${counter}] commit and export to all locales`]: function(client) {
      const commitBtnSelector = '[data-apos-workflow-commit]';
      const modalDialogSelector = '.apos-workflow-commit-modal';
      const confirmBtnSelector = `${modalDialogSelector} [data-apos-save]`;
      const exportBtnSelector = '.apos-workflow-export-modal [data-apos-save]';
      const masterLocaleBtnSelector = '[for*=en] span';

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
        client.pause(1000);
        client.click(exportBtnSelector);
      }

      client.waitForElementNotPresent(modalDialogSelector);
    }
  };
};
