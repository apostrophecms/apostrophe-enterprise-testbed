const server = require('apostrophe-nightwatch-tools/server');
const steps = require('apostrophe-nightwatch-tools/steps');

const dogTraitsMessageSelector = '[data-apos-input-message="DogTraits"]';
const formMessageSelector = '[data-apos-forms-submit-error]';
const formSubmitSelector = '[data-apos-forms-form] button[type="submit"]';

module.exports = Object.assign(
  {
    before: (client, done) => {
      // eslint-disable-next-line camelcase
      const { apos_address, apos_port } = client.globals.test_settings;
      client.resizeWindow(1200, 800);
      this._server = server.create(apos_address, apos_port);

      this._server.start((err) => {
        if (err) {
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
    '️📝 Add a form to a page and commit': (client) => {
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
    '👀 Review the form': (client) => {
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
      client.expect.element(dogTraitsMessageSelector).to.be.present;
      client.expect.element(dogTraitsMessageSelector).to.not.be.visible;
      client.expect.element(formMessageSelector).to.be.present;
      client.expect.element(formMessageSelector).to.not.be.visible;
    }
  },
  {
    '🙅‍♀️ Fill out the form insufficiently (trigger errors)': (client) => {
      // Move field into view.
      client.click('input[name="DogName"]');
      client.setValue('input[name="DogName"]', 'Benny');
      client.click('[name="DogBreed"][value="Dachshund"] + label');
      client.click('select[name="DogToy"] option[value="Frisbee"]');
      client.click(formSubmitSelector);
      client.pause(100);

      client.expect.element(dogTraitsMessageSelector).to.be.visible;
      client.expect.element(dogTraitsMessageSelector).text.to.equal('This field is required');
      client.expect.element(formMessageSelector).to.be.visible;
      client.expect.element(formMessageSelector).text.to.equal('An error occurred submitting the form. Please try again.');
    }
  },
  {
    '🙆‍♀️ Fix the form submission and submit successfully': (client) => {
      const thankYouSelector = '[data-apos-forms-thank-you]';

      client.click('input[name="DogTraits"][value="Likes treats"]');
      client.click('input[name="DogTraits"][value="Barks loudly"]');
      client.click(formSubmitSelector);
      client.pause(100);

      client.expect.element(`${thankYouSelector} h3`).text.to.equal('Gracias.');
      client.expect.element(`${thankYouSelector} p`).text.to.equal('Thanks for your submission!');
    }
  }
);
