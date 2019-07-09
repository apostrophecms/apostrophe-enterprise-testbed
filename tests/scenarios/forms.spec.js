const server = require('apostrophe-nightwatch-tools/server');
const steps = require('apostrophe-nightwatch-tools/steps');

module.exports = Object.assign(
  {
    before: (client, done) => {
      // eslint-disable-next-line camelcase
      const { apos_address, apos_port } = client.globals.test_settings;
      client.resizeWindow(1200, 800);
      this._server = server.create(apos_address, apos_port);

      this._server.start((err) => {
        if (err) {
          console.error(err);
          return done(err);
        }
        this._server.task('apostrophe-forms:addForm');
        // Migration task must not crash when run noninteractively (pipe to file)
        if (this._server.task('apostrophe-migrations:migrate > /tmp/migrate.results').code !== 0) {
          return done('MIGRATION ERROR');
        }
        return done();
      });
    },
    after: (client, done) => {
      client.end(() => {
        this._server.stop(function () {
          done();
        });
      });
    }
  },
  steps.main(),
  steps.login(),
  steps.switchToDraftMode(),
  steps.makeSubPage('Form test'),
  {
    'Add a form to a page': (client) => {
      const mainBlockSelector = '.demo-main';
      const addContentBtnSelector = `${mainBlockSelector} [data-apos-add-content]`;
      const formWidgetBtnSelector = `${mainBlockSelector} [data-apos-add-item=apostrophe-forms]`;
      const browseBtnSelector = '[data-apos-browse]';

      const saveWidgetBtnSelector = '[data-apos-save]';

      // To make sure we scroll down far enough to eliminate certain conflicts
      client.click('footer');
      client.clickWhenReady(addContentBtnSelector);
      client.clickWhenReady(formWidgetBtnSelector);
      client.waitForModal('apostrophe-forms-widgets-editor');
      client.clickInModal('apostrophe-forms-widgets-editor', browseBtnSelector);
      client.waitForModal('apostrophe-forms-manager-modal');
      client.clickInModal('apostrophe-forms-manager-modal', '[data-apos-manage-view] [data-piece]:first-child label');
      client.clickInModal('apostrophe-forms-manager-modal', saveWidgetBtnSelector);
      client.waitForModal('apostrophe-forms-widgets-editor');
      client.clickInModal('apostrophe-forms-widgets-editor', saveWidgetBtnSelector);

      // Great expectations:
      client.expect.element('.apos-forms-label').to.be.present;
    }
  }
);
