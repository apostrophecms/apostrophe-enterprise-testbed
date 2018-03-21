let counter = 0;

module.exports = () => {
  counter++;

  return {
    [`[${counter}] commit all changes`]: function(client) {
      // TODO: commit specified times

      const commitBtnSelector = '[data-apos-workflow-commit]';
      const modalDialogSelector = '.apos-workflow-commit-modal';
      const confirmBtnSelector = `${modalDialogSelector} [data-apos-save]`;
      const exportBtnSelector = '.apos-workflow-export-modal [data-apos-save]';
      const masterLocaleBtnSelector = '[for*=master] span';

      client.click(commitBtnSelector);
      client.waitForElementVisible(modalDialogSelector, 2000);
      client.click(confirmBtnSelector);
      client.click(masterLocaleBtnSelector);
      client.click(exportBtnSelector);

      // TODO: we can capture and see messages about commiting and exporting
      // but modal dialog is visible
      // client.waitForElementNotVisible(modalDialogSelector, 2000);
    }
  };
};
