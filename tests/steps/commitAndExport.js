let counter = 0;

module.exports = (itemsCount = 1) => {
  counter++;

  return {
    [`[${counter}] commit app`]: function(client) {
      const commitBtnSelector = '[data-apos-workflow-commit]';
      const modalDialogSelector = '.apos-workflow-commit-modal';
      const confirmBtnSelector = `${modalDialogSelector} [data-apos-save]`;
      const exportBtnSelector = '.apos-workflow-export-modal [data-apos-save]';
      const masterLocaleBtnSelector = '[for*=master] span';

      client.pause(200);
      client.waitForElementReady(commitBtnSelector);
      client.clickWhenReady(commitBtnSelector);

      for (let i = 0; i < itemsCount; i++) {
        client.pause(1000);
        client.waitForElementReady(modalDialogSelector);
        client.waitForElementReady(confirmBtnSelector);
        client.clickWhenReady(confirmBtnSelector);

        // APOS store information about selected locales,
        // so that we must du not once
        if (i === 0) {
          client.waitForElementReady(masterLocaleBtnSelector);
          client.clickWhenReady(masterLocaleBtnSelector);
        }

        client.waitForElementReady(exportBtnSelector);
        client.pause(1000);
        client.clickWhenReady(exportBtnSelector);
      }

      client.waitForElementNotPresent(modalDialogSelector);
    }
  };
};
