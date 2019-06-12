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
  steps.makeSubPage('Personas Test'),
  {
    'Add Two Column Block': function (client) {
      const blackoutSelector = '.apos-modal-blackout';
      const addContentBtnSelector = `.demo-secondary [data-apos-add-content]`;
      const twoColumnBlockSelector = `.demo-secondary [data-apos-add-item=as-two-column-block]`;
      client.waitForElementNotPresent(blackoutSelector);
      client.getLocationInView('.demo-secondary');
      client.waitForElementReady(addContentBtnSelector);
      client.clickWhenReady(addContentBtnSelector);
      client.waitForElementReady(twoColumnBlockSelector);
      client.pause(200);
      client.clickWhenReady(twoColumnBlockSelector);
      client.pause(2000);
    }
  },
  steps.addTextWidgetTo({selector: '.demo-main', text: 'Robot'}),
  steps.submitChanges(),
  {
    'Switch to robot persona': function(client) {
      const personaSelect = '.demo-main .apos-area-widget-controls .apos-button[name=personas]';
      const testPersonaValue = `${personaSelect} option[value="robot"]`;
      const richText = '.demo-main [data-rich-text]';
      client.moveToElement(personaSelect, 0, 0);
      client.clickWhenReady(personaSelect);
      client.clickWhenReady(testPersonaValue);
      client.pause(500);
    }
  },
  steps.commitAndExport(),
  steps.addTextWidgetTo({selector: '.demo-secondary .column.width-50', text: 'Human'}),
  steps.submitChanges(),
  {
    'Switch to human persona': function(client) {
      const personaSelect = '.demo-secondary .column.width-50 .apos-area-widget-controls .apos-button[name=personas]';
      const testPersonaValue = `${personaSelect} option[value="human"]`;
      const richText = '.demo-secondary .column.width-50 [data-rich-text]';
      client.moveToElement(personaSelect, 0, 0);
      client.clickWhenReady(personaSelect);
      client.clickWhenReady(testPersonaValue);
      client.pause(500);
    }
  },
  steps.commitAndExport(),
  {
    'Wait for notification cluster to slow down': function (client) {
      client.pause(2000);
    }
  },
  {
    'Hide apos notifications': function (client) {
      client.execute(function() {
        $('.apos-notification').hide();
      });
    }
  },
  {
    'Wait for notification cluster to slow down': function (client) {
      client.pause(2000);
    }
  },
  steps.addTextWidgetTo({selector: '.demo-secondary .column.width-40', text: 'No Persona'}),
  steps.submitChanges(),
  {
    'Switch to no persona': function(client) {
      const personaSelect = '.demo-secondary .column.width-40 .apos-area-widget-controls .apos-button[name=personas]';
      const testPersonaValue = `${personaSelect} option[value="none"]`;
      const richText = '.demo-secondary .column.width-40 [data-rich-text]';
      client.moveToElement(personaSelect, 0, 0);
      client.clickWhenReady(personaSelect);
      client.clickWhenReady(testPersonaValue);
      client.pause(500);
    }
  },
  steps.commitAndExport(),
  steps.addTextWidgetTo({selector: '.footer', text: 'Universal'}),
  {
    'Add universal class to rich text': function(client) {
      const richText = '.footer [data-rich-text]';
    }
  },
  steps.submitChanges(),
  steps.commitAndExport(),
  {
    'log out of Apostrophe': function(client) {
      client.openAdminBarItem('apostrophe-login-logout')
    }
  },
  steps.navigateToRelativeUrl('robot/personas-test'),
  {
    'ROBOT PERSONA: should have the rich text widget in robot persona': function(client) {
      const robotRichTextSelector = '.demo-main [data-rich-text]';
      client.expect.element(robotRichTextSelector).text.to.contain('Robot');
    }
  },
  {
    'ROBOT PERSONA: should have the rich text widget in universal persona': function(client) {
      const universalRichTextSelector = '.footer [data-rich-text]';
      client.expect.element(universalRichTextSelector).text.to.contain('Universal');
    }
  },
  {
    'ROBOT PERSONA: should not have the rich text widget in human persona': function(client) {
      const humanRichTextSelector = '.demo-secondary .column.width-50 [data-rich-text]';
      client.expect.element(humanRichTextSelector).to.not.be.present;
    }
  },
  {
    'ROBOT PERSONA: should not have the rich text widget in none persona': function(client) {
      const noneRichTextSelector = '.demo-secondary .column.width-40 [data-rich-text]';
      client.expect.element(noneRichTextSelector).to.not.be.present;
    }
  },
  steps.navigateToHome(),
  steps.navigateToRelativeUrl('human/personas-test'),
  {
    'HUMAN PERSONA: should not have the rich text widget in robot persona': function(client) {
      const robotRichTextSelector = '.demo-main [data-rich-text]';
      client.expect.element(robotRichTextSelector).to.not.be.present;
    }
  },
  {
    'HUMAN PERSONA: should have the rich text widget in universal persona': function(client) {
      const universalRichTextSelector = '.footer [data-rich-text]';
      client.expect.element(universalRichTextSelector).text.to.contain('Universal');
    }
  },
  {
    'HUMAN PERSONA: should have the rich text widget in human persona': function(client) {
      const humanRichTextSelector = '.demo-secondary .column.width-50 [data-rich-text]';
      client.expect.element(humanRichTextSelector).text.to.contain('Human');
    }
  },
  {
    'HUMAN PERSONA: should not have the rich text widget in none persona': function(client) {
      const noneRichTextSelector = '.demo-secondary .column.width-40 [data-rich-text]';
      client.expect.element(noneRichTextSelector).to.not.be.present;
    }
  },
  steps.navigateToHome(),
  steps.navigateToRelativeUrl('personas-test'),
  {
    'UNIVERSAL PERSONA: should have all the widgets': function(client) {
      const robotRichTextSelector = '.demo-main [data-rich-text]';
      const universalRichTextSelector = '.footer [data-rich-text]';
      const humanRichTextSelector = '.demo-secondary .column.width-50 [data-rich-text]';
      const noneRichTextSelector = '.demo-secondary .column.width-40 [data-rich-text]';
      client.expect.element(robotRichTextSelector).text.to.contain('Robot');
      client.expect.element(universalRichTextSelector).text.to.contain('Universal');
      client.expect.element(humanRichTextSelector).text.to.contain('Human');
      client.expect.element(noneRichTextSelector).text.to.contain('No Persona');
    }
  }
);
