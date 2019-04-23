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
  steps.addTextWidgetTo({selector: '.demo-main', text: 'Rich Text Widget Robot Line'}),
  steps.submitChanges(),
  {
    'Switch to robot persona': function(client) {
      const personaSelect = '.demo-main .apos-area-widget-controls .apos-button[name=personas]';
      const testPersonaValue = `${personaSelect} option[value="robot"]`;
      client.moveToElement(personaSelect, 0, 0);
      client.clickWhenReady(personaSelect);
      client.clickWhenReady(testPersonaValue);
      client.pause(500);
    }
  },
  steps.commitAndExport(),
  {
    'add video widget': function(client) {
      const selector = '.demo-main .apos-area-widget-wrapper';
      const addContentBtnSelector = `${selector} [data-apos-add-content]`;
      const videoBtnSelector = `${selector} [data-apos-add-item=apostrophe-video]`;
      const videoInput = `.apos-field-input[name=video]`;
      const videoUrl = 'https://www.youtube.com/watch?v=OV1yagf8Uqk';
      const save = '[data-apos-save]';
      client.getLocationInView(selector);
      client.moveToElement(addContentBtnSelector, 0, 0);
      client.waitForElementReady(addContentBtnSelector);
      client.clickWhenReady(addContentBtnSelector);
      client.waitForElementReady(videoBtnSelector);
      client.pause(200);
      client.clickWhenReady(videoBtnSelector);
      client.waitForModal('apostrophe-video-widgets-editor');
      client.resetValueInModal('apostrophe-video-widgets-editor', videoInput, videoUrl);
      client.pause(3000);
      client.clickInModal('apostrophe-video-widgets-editor', save);
      client.waitForNoModals();
    }
  },
  {
    'Switch to human persona': function(client) {
      const aposUi = '[data-apos-widget-wrapper=apostrophe-video] .apos-area-widget-controls'
      const personaSelect = `${aposUi} .apos-button[name=personas]`;
      const humanPersonaValue = `${personaSelect} option[value="human"]`;
      client.execute(function(aposUi) {
        $(aposUi).css({opacity: '1'});
      },[aposUi]);
      client.moveToElement(personaSelect, 0, 0);
      client.clickWhenReady(personaSelect);
      client.clickWhenReady(humanPersonaValue);
    }
  },
  {
    'Hide video widget to avoid accidently playing it when submitting': function(client) {
      const aposUi = '[data-apos-widget-wrapper=apostrophe-video]'
      client.execute(function(aposUi) {
        $(aposUi).css({display: 'none'});
      },[aposUi]);
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
    'should have the Rich Text widget in robot persona': function(client) {
      const richTextSelector = `.demo-main [data-rich-text]`;
      client.expect.element(richTextSelector).text.to.contain('Rich Text Widget Robot Line');
    }
  },
  steps.navigateToHome(),
  steps.navigateToRelativeUrl('human/personas-test'),
  {
    'should have the Video widget in human persona': function(client) {
      const videoWidget = `.demo-main [data-apos-widget-wrapper=apostrophe-video]`;
      client.expect.element(videoWidget).to.be.present;
    }
  },
  steps.navigateToHome(),
  steps.navigateToRelativeUrl('personas-test'),
  {
    'should not have any widgets in universal persona': function(client) {
      const richTextSelector = `.demo-main [data-rich-text]`;
      const videoWidgetSelector = `.demo-main [data-apos-widget-wrapper=apostrophe-video]`;
      client.expect.element(richTextSelector).to.not.be.present;
      client.expect.element(richTextSelector).to.not.be.present;
    }
  },
);
