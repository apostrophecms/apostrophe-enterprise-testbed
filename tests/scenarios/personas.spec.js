const server = require('apostrophe-nightwatch-tools/server');
const steps = require('apostrophe-nightwatch-tools/steps');
const sauce = require('../sauce');

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
  steps.addTextWidgetTo({selector: '.demo-main', text: 'Rich Text Widget line'}),
  steps.submitChanges(),
  {
    'Switch to test persona': function(client) {
      const personaSelect = '.apos-area-widget-controls .apos-button[name=personas]';
      const testPersonaValue = `${personaSelect} option[value="robot"]`;
      client.moveToElement(personaSelect, 0, 0);
      client.clickWhenReady(personaSelect);
      client.clickWhenReady(testPersonaValue);
      client.pause(500);
    }
  },
  steps.commitAndExport(),
  steps.switchToLiveMode(),
  {
    'log out of Apostrophe': function(client) {
      client.openAdminBarItem('apostrophe-login-logout')
    }
  },
  steps.navigateToRelativeUrl('robot/personas-test'),
  {
    'should have the Rich Text widget in correct persona': function(client) {
      const richTextSelector = `.demo-main [data-rich-text]`;
      client.expect.element(richTextSelector).text.to.contain('Rich Text Widget line');
    }
  },
  steps.navigateToHome(),
  steps.navigateToRelativeUrl('personas-test'),
  {
    'should not have the Rich Text widget': function(client) {
      const richTextSelector = `.demo-main [data-rich-text]`;
      client.expect.element(richTextSelector).to.not.be.present;
    }
  },
);
