let counter = 0;

module.exports = (itemsCount = 1) => {
  counter++;

  return {
    [`[${counter}] commit app`]: function(client) {
      const commitBtnSelector = '[data-apos-workflow-commit]';
      const confirmBtnSelector = `[data-apos-save]`;
      const exportBtnSelector = '[data-apos-save]';
      const masterLocaleBtnSelector = '[for*=master] span';

      client.waitForElementReady(commitBtnSelector);
      client.clickWhenReady(commitBtnSelector);

      for (let i = 0; i < itemsCount; i++) {
        client.clickInModal('apostrophe-workflow-commit-modal', confirmBtnSelector);

        // Apostrophe remembers between modals, so
        // don't toggle them on and off, just click once
        if (i === 0) {
          client.clickInModal('apostrophe-workflow-export-modal', masterLocaleBtnSelector);
        }

        client.clickInModal('apostrophe-workflow-export-modal', exportBtnSelector);
      }

      client.waitForNoModals();
    }
  };
};
