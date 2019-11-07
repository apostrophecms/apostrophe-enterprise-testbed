const server = require('apostrophe-nightwatch-tools/server');
const steps = require('apostrophe-nightwatch-tools/steps');
const humanRichTextSelector = '[data-role=primary] [data-rich-text]';
const robotRichTextSelector = '[data-role=secondary] [data-rich-text]';
const noneRichTextSelector = '[data-role=tertiary] [data-rich-text]';
const universalRichTextSelector = '[data-role=quaternary] [data-rich-text]';

module.exports = Object.assign(
  {
    before: (client, done) => {
      client.resizeWindow(1200, 1200);
      if (!this._server) {
        this._server = server.create('localhost', 3111);
        this._server.start(done);
      }
    },
    after: (client, done) => {
      client.end(() => {
        this._server.stop(done);
      });
    },
  },
  steps.main(),
  steps.login(),
  steps.switchLocale('en'),
  steps.switchToDraftMode(),
  {
    'Make personas page': function (client) {
      const pageMenuBtnSelector = '.apos-context-menu .apos-button';
      const pageMenuDropdownSelector = '.apos-context-menu .apos-dropdown-items';
      const pageMenuCreatePageSelector = '.apos-context-menu .apos-dropdown-items .apos-dropdown-item:first-child';
      const pageName = 'Personas';
      client.clickWhenReady(pageMenuBtnSelector);
      client.waitForElementReady(pageMenuDropdownSelector);
      client.clickWhenReady(pageMenuCreatePageSelector);
      client.resetValueInModal('apostrophe-pages-editor', '[name="title"]', pageName);
      client.resetValueInModal('apostrophe-pages-editor', '[name="type"]', 'Personas (Testing)');
      client.clickInModal('apostrophe-pages-editor', '[data-apos-save]');
    }
  },
  steps.addTextWidgetTo({selector: '[data-role=primary]', text: 'Human'}),
  {
    'Unfocus "human" apostrophe-rich-text editor': function (client) {
      client.click('[data-role=target]');
    }
  },
  steps.changeWidgetPersona({selector: '[data-role=primary]', value: 'human'}),
  steps.addTextWidgetTo({selector: '[data-role=secondary]', text: 'Robot'}),
  {
    'Unfocus "robot" apostrophe-rich-text editor': function (client) {
      client.click('[data-role=target]');
    }
  },
  steps.changeWidgetPersona({selector: '[data-role=secondary]', value: 'robot'}),
  steps.addTextWidgetTo({selector: '[data-role=tertiary]', text: 'No Persona'}),
  {
    'Unfocus "no persona" apostrophe-rich-text editor': function (client) {
      client.click('[data-role=target');
    }
  },
  steps.changeWidgetPersona({selector: '[data-role=tertiary]', value: 'none'}),
  steps.addTextWidgetTo({selector: '[data-role=quaternary]', text: 'Universal'}),
  steps.commit(),
  {
    '[1] log out of Apostrophe': function(client) {
      client.openAdminBarItem('apostrophe-login-logout')
    }
  },
  steps.navigateToRelativeUrl('robot/personas'),
  {
    'ROBOT PERSONA: should display both "robot" and "universal" widgets, and not display "human" or "no persona" widgets.': function(client) {
      client.expect.element(robotRichTextSelector).text.to.contain('Robot');
      client.expect.element(universalRichTextSelector).text.to.contain('Universal');
      client.expect.element(humanRichTextSelector).to.not.be.present;
      client.expect.element(noneRichTextSelector).to.not.be.present;
    }
  },
  steps.navigateToHome(),
  steps.navigateToRelativeUrl('human/personas'),
  {
    'Human PERSONA: should display both "human" and "universal" widgets, and not display "robot" or "no persona" widgets.': function(client) {
      client.expect.element(robotRichTextSelector).to.not.be.present;
      client.expect.element(universalRichTextSelector).text.to.contain('Universal');
      client.expect.element(humanRichTextSelector).text.to.contain('Human');
      client.expect.element(noneRichTextSelector).to.not.be.present;
    }
  },
  steps.navigateToHome(),
  steps.navigateToRelativeUrl('personas'),
  {
    'UNIVERSAL PERSONA: should have all the widgets': function(client) {
      client.expect.element(robotRichTextSelector).text.to.contain('Robot');
      client.expect.element(universalRichTextSelector).text.to.contain('Universal');
      client.expect.element(humanRichTextSelector).text.to.contain('Human');
      client.expect.element(noneRichTextSelector).text.to.contain('No Persona');
    }
  },
  steps.main(),
  steps.login(),
  steps.switchLocale('en'),
  steps.switchToDraftMode(),
  steps.navigateToRelativeUrl('personas'),
  steps.changeWidgetPersona({selector: '[data-role=secondary]', value: 'human'}),
  steps.commit(),
  {
    '[2] log out of Apostrophe': function(client) {
      client.openAdminBarItem('apostrophe-login-logout')
    }
  },
  steps.navigateToRelativeUrl('human/personas'),
  {
    'HUMAN PERSONA: Should have both "universal" and "human" widgets, as well as the recently changed "robot" widget. "No Persona" should not be visible.': function(client) {
      client.expect.element(robotRichTextSelector).text.to.contain('Robot');
      client.expect.element(universalRichTextSelector).text.to.contain('Universal');
      client.expect.element(humanRichTextSelector).text.to.contain('Human');
      client.expect.element(noneRichTextSelector).to.not.be.present;
    }
  }
);
