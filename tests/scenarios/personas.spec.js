const server = require('apostrophe-nightwatch-tools/server');
const steps = require('apostrophe-nightwatch-tools/steps');

module.exports = Object.assign(
  {
    before: (client, done) => {
      client.resizeWindow(1200, 800);
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
      client.resetValueInModal('apostrophe-pages-editor', '[name="type"]', 'personas');
      client.clickInModal('apostrophe-pages-editor', '[data-apos-save]');
    }
  },

  steps.addTextWidgetTo({selector: '[data-role=primary]', text: 'Human'}),
  {
    'Click out of rich text': function (client) {
      client.click('[data-role=target]');
    }
  },
  {
    'Switch to human persona': function(client) {
      const personaSelect = '[data-role=primary] .apos-area-widget-controls .apos-button[name=personas]';
      const testPersonaValue = `${personaSelect} option[value="human"]`;
      const richText = '[data-role=primary] [data-rich-text]';
      client.pause(2000);
      client.moveToElement(personaSelect, 0, 0);
      client.clickWhenReady(personaSelect);
      client.clickWhenReady(testPersonaValue);
      client.pause(500);
    }
  },
  {
    'take snapshot': function (client) {
      client.saveScreenshot('./screenshots/human.png');
    }
  },

  steps.addTextWidgetTo({selector: '[data-role=secondary]', text: 'Robot'}),
  {
    'Click out of rich text 2': function (client) {
      client.click('[data-role=target]');
    }
  },
  {
    'Switch to robot persona': function(client) {
      const personaSelect = '[data-role=secondary] .apos-area-widget-controls .apos-button[name=personas]';
      const testPersonaValue = `${personaSelect} option[value="robot"]`;
      const richText = '[data-role=secondary] [data-rich-text]';
      client.pause(2000);
      client.moveToElement(personaSelect, 0, 0);
      client.clickWhenReady(personaSelect);
      client.clickWhenReady(testPersonaValue);
      client.pause(500);
    }
  },
  {
    'take snapshot 1': function (client) {
      client.saveScreenshot('./screenshots/robot.png');
    }
  },

  steps.addTextWidgetTo({selector: '[data-role=tertiary]', text: 'No Persona'}),
  {
    'Click out of another rich text again': function (client) {
      client.click('[data-role=target');
      client.saveScreenshot('./screenshots/noPersonaText.png');
    }
  },
  {
    'Switch to no persona': function(client) {
      const personaSelect = '[data-role=tertiary] .apos-area-widget-controls .apos-button[name=personas]';
      const testPersonaValue = `${personaSelect} option[value="none"]`;
      const richText = '[data-role=tertiary] [data-rich-text]';
      client.pause(2000);
      client.moveToElement(personaSelect, 0, 0);
      client.clickWhenReady(personaSelect);
      client.clickWhenReady(testPersonaValue);
      client.pause(500);
    }
  },

  {
    'take snapshot 2': function (client) {
      client.saveScreenshot('./screenshots/no_persona.png');
    }
  },

  steps.addTextWidgetTo({selector: '[data-role=quaternary]', text: 'Universal'}),
  {
    'take snapshot 3': function (client) {
      client.saveScreenshot('./screenshots/test.png');
    }
  },
  steps.commit()
  // {
  //   'log out of Apostrophe': function(client) {
  //     client.openAdminBarItem('apostrophe-login-logout')
  //   }
  // },
  // steps.navigateToRelativeUrl('human/personas'),
  // {
  //   'ROBOT PERSONA: should display both the "robot" and "universal" widgets, and not display the "human" or "none" widgets.': function(client) {
  //     const universalRichTextSelector = '[data-role=quaternary] [data-rich-text]';
  //     const humanRichTextSelector = '[data-role=secondary] [data-rich-text]';
  //     const noneRichTextSelector = '[data-role=tertiary] [data-rich-text]';
  //     client.expect.element(universalRichTextSelector).text.to.contain('Universal');
  //     client.expect.element(humanRichTextSelector).text.to.contain('Human');
  //     client.expect.element(noneRichTextSelector).to.not.be.present;
  //   }
  // },
  // steps.navigateToHome(),
  // steps.navigateToRelativeUrl('personas'),
  // {
  //   'UNIVERSAL PERSONA: should have all the widgets': function(client) {
  //     const universalRichTextSelector = '[data-role=quaternary] [data-rich-text]';
  //     const humanRichTextSelector = '[data-role=secondary] [data-rich-text]';
  //     const noneRichTextSelector = '[data-role=tertiary] [data-rich-text]';
  //     client.expect.element(universalRichTextSelector).text.to.contain('Universal');
  //     client.expect.element(humanRichTextSelector).text.to.contain('Human');
  //     client.expect.element(noneRichTextSelector).text.to.contain('No Persona');
  //   }
  // }
);
