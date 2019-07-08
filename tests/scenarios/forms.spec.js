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
    'create a form': (client) => {
      const mainBlockSelector = '.demo-main';
      const addContentBtnSelector = `${mainBlockSelector} [data-apos-add-content]`;
      const formWidgetBtnSelector = `${mainBlockSelector} [data-apos-add-item=apostrophe-forms]`;
      const browseBtnSelector = '[data-apos-browse]';
      const newFormBtnSelector = '[data-apos-create-apostrophe-forms]';
      const formEditorModal = '[data-apos-modal-current="apostrophe-forms-editor-modal"]';
      const formTabSelector = '[data-apos-open-group="form"]';
      const addFieldSelector = `[data-name="contents"]  [data-apos-add-content]`;
      const saveWidgetBtnSelector = '[data-apos-save]';

      // To make sure we scroll down far enough to eliminate certain conflicts
      client.click('footer');
      client.clickWhenReady(addContentBtnSelector);
      client.clickWhenReady(formWidgetBtnSelector);
      client.waitForModal('apostrophe-forms-widgets-editor');
      client.clickInModal('apostrophe-forms-widgets-editor', browseBtnSelector);
      client.waitForModal('apostrophe-forms-manager-modal');
      client.clickInModal('apostrophe-forms-manager-modal', newFormBtnSelector);
      client.waitForModal('apostrophe-forms-editor-modal');
      client.setValue(`${formEditorModal} input[name="title"]`, 'Contact Form');
      client.setValue(`${formEditorModal} input[name="slug"]`, 'contact-form');
      client.clickInModal('apostrophe-forms-editor-modal', formTabSelector);

      // Add a required text field
      client.clickInModal('apostrophe-forms-editor-modal', addFieldSelector);
      client.clickInModal('apostrophe-forms-editor-modal', '[data-apos-add-item=apostrophe-forms-text-field]');
      client.waitForModal('apostrophe-forms-text-field-widgets-editor');
      client.setValue(`input[name="fieldLabel"]`, 'Your Name');
      client.setValue(`input[name="fieldName"]`, 'name');
      client.setValue(`select[name="required"]`, '1');
      client.clickInModal('apostrophe-forms-text-field-widgets-editor', saveWidgetBtnSelector);
      client.waitForModal('apostrophe-forms-editor-modal');

      client.setValue('[name="submitLabel"]', 'Send');
      // Save form.
      client.pause(5000);
      client.clickInModal('apostrophe-forms-editor-modal', saveWidgetBtnSelector);
      client.waitForModal('apostrophe-forms-manager-modal');
      client.clickInModal('apostrophe-forms-manager-modal', saveWidgetBtnSelector);
      client.waitForModal('apostrophe-forms-widgets-editor');
      client.clickInModal('apostrophe-forms-widgets-editor', saveWidgetBtnSelector);

      // Great expectations:
      client.expect.element('.apos-forms-label').to.be.present;
    }
  }
);
