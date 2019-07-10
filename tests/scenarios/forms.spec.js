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
    '️☑️ Add a form to a page and commit': (client) => {
      const mainBlockSelector = '.demo-main';
      const addContentBtnSelector = `${mainBlockSelector} [data-apos-add-content]`;
      const formWidgetBtnSelector = `${mainBlockSelector} [data-apos-add-item=apostrophe-forms]`;
      const browseBtnSelector = '[data-apos-browse]';
      const saveButtonSelector = '[data-apos-save]';
      const commitModalClass = 'apostrophe-workflow-commit-modal';

      // To make sure we scroll down far enough to eliminate certain conflicts
      client.click('footer');
      client.clickWhenReady(addContentBtnSelector);
      client.clickWhenReady(formWidgetBtnSelector);
      client.waitForModal('apostrophe-forms-widgets-editor');
      client.clickInModal('apostrophe-forms-widgets-editor', browseBtnSelector);
      client.waitForModal('apostrophe-forms-manager-modal');
      client.clickInModal('apostrophe-forms-manager-modal', '[data-apos-manage-view] [data-piece]:first-child label');
      client.clickInModal('apostrophe-forms-manager-modal', saveButtonSelector);
      client.waitForModal('apostrophe-forms-widgets-editor');
      client.clickInModal('apostrophe-forms-widgets-editor', saveButtonSelector);

      // Make sure the form is on the page.
      client.expect.element('input[name="DogName"]').to.be.present;

      // Commit the page and switch to live mode.
      client.click('[data-apos-workflow-commit]');
      client.waitForModal(commitModalClass);
      client.clickInModal(commitModalClass, saveButtonSelector);
      client.waitForModal('apostrophe-workflow-export-modal');
      client.clickInModal('apostrophe-workflow-export-modal', '.apos-workflow-locale-control-label[for="locales[master]"]');
      client.clickInModal('apostrophe-workflow-export-modal', saveButtonSelector);
      client.pause(2000); // TEMP
    }
  },
  steps.commit(),
  steps.switchToLiveMode(),
  {
    '☑️ Review the form': (client) => {
      // Move us down the page.
      client.click('footer');
      client.pause(1000); // TEMP
      client.expect.element('input[name="DogName"]').to.be.present;
      client.expect.element('input[name="DogName"]').to.have.attribute('required');
      client.expect.element('input[name="DogTraits"][value="Runs fast"]').to.be.present;
      client.expect.element('input[name="DogTraits"][value="Barks loudly"]').to.be.present;
      client.expect.element('input[name="DogTraits"][value="Likes treats"]').to.be.present;
      client.expect.element('input[name="DogPhoto"][type="file"]').to.be.present;
      client.expect.element('select[name="DogToy"]').to.have.attribute('required');
      client.expect.element('[name="participate"]').to.have.attribute('required');
      client.expect.element('[name="participate"]').to.have.attribute('checked');
    }
  }
);
