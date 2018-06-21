let counter = 0;

module.exports = (type) => {
  counter++;

  return {
    [`[${counter}] change page type to ${type}`]: function(client) {
      const pageMenuBtnSelector = '.apos-context-menu .apos-button';
      const pageSettingsSelector = '[data-apos-update-page]';
      const saveBtnSelector = '[data-apos-save]';
      const blackoutSelector = '.apos-modal-blackout';
      const demoHeaderSelector = '.demo-header h5';
      const busyLayerSelector = '.apos-global-busy.active';

      client.clickWhenReady(pageMenuBtnSelector);
      client.waitForElementReady(pageSettingsSelector);
      client.clickWhenReady(pageSettingsSelector);
      client.resetValueInModal('apostrophe-pages-editor-update', 'select[name="type"]', type);
      client.clickInModal('apostrophe-pages-editor-update', saveBtnSelector);
      client.waitForNoModals();
      client.expect.element(demoHeaderSelector).text.to.contain(`You are on the "${type}" template`);
    }
  };
};
