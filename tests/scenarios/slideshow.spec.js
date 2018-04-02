const path = require('path');
const server = require('../server');
const steps = require('../steps');

const fixturesPath = path.resolve(__dirname, '..', 'fixtures');

module.exports = Object.assign(
  {
    before: (client, done) => {
      client.resizeWindow(1200, 800);

      this._server = server.create();
      this._server.start(done);
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
  steps.makeSubPage('Regression test'),
  steps.submitChanges(),
  {
    'upload images': function(client) {
      const contextBtnSelector = '.demo-main [data-apos-add-content]';
      const contextSubMenuSelector = '.demo-main .apos-dropdown-items';
      const contextSubMenuImageSelector = '.demo-main [data-apos-add-item=apostrophe-images]';
      const modalDialogSelector = '.apos-apostrophe-image-manager';
      const fileInputSelector = '.apos-modal-controls input';
      const loadedImagesSelector = '.apos-manage-grid-image';
      const selectImagesBtnSelector = '.apos-apostrophe-image-manager [data-apos-save]';
      const resultDraftSliderSelector = '[data-slideshow-item]';

      client.pause(200);
      client.click('body');
      client.click(contextBtnSelector);
      client.waitForElementVisible(contextSubMenuSelector, 3000);
      client.click(contextSubMenuImageSelector);
      client.waitForElementVisible(modalDialogSelector, 7000);
      client.execute(function() {
        $('.apos-modal-controls input').css({display: 'block'});
      });
      client.waitForElementVisible(fileInputSelector, 7000);
      client.setValue(fileInputSelector, path.join(fixturesPath, 'slide1.jpg'));
      client.setValue(fileInputSelector, path.join(fixturesPath, 'slide2.jpg'));
      client.waitForElementPresent(loadedImagesSelector, 50000);
      client.pause(400); // paranja
      client.click(selectImagesBtnSelector);
      client.waitForElementPresent(resultDraftSliderSelector, 50000);
      client.pause(400); // paranja
    }
  },
  steps.submitChanges(),
  steps.checkSubmitted(['slide1', 'slide2',]),
  steps.commitChanges(3),
  steps.switchToLiveMode(),
  {
    'check images': function(client) {
      const slideshowSelector = '.apos-slideshow';
      const slideshow2nItemSelector = `${slideshowSelector} .apos-slideshow-item:nth-child(2)`;

      client.waitForElementVisible(slideshowSelector, 50000);

      client.expect.element(slideshowSelector).to.be.present;
      client.expect.element(slideshow2nItemSelector).to.be.present;
    }
  }
);
