const cheerio = require('cheerio');
const request = require('request');
const path = require('path');
const server = require('../server');
const steps = require('../steps');
const sauce = require('../sauce');

const fixturesPath = path.resolve(__dirname, '..', 'fixtures');
const slideshowSelector = '.apos-slideshow';
const slideshow2nItemSelector = `${slideshowSelector} .apos-slideshow-item:nth-child(2)`;

module.exports = Object.assign(
  {
    before: (client, done) => {
      client.resizeWindow(1200, 800);
      if (!this._server) {
        this._server = server.create('localhost', 3111, 'app_2');
        this._server.start(done);
      }
    },
    afterEach: sauce,
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
      const busyLayerSelector = '.apos-global-busy.active';

      client.pause(200);
      client.click('body');
      client.click(contextBtnSelector);
      client.waitForElementVisible(contextSubMenuSelector);
      client.click(contextSubMenuImageSelector);
      client.waitForElementVisible(modalDialogSelector);
      client.execute(function() {
        $('.apos-modal-controls input').css({display: 'block'});
      });
      client.waitForElementVisible(fileInputSelector);
      client.uploadLocalFile(fileInputSelector, path.join(fixturesPath, 'slide1.jpg'));
      client.uploadLocalFile(fileInputSelector, path.join(fixturesPath, 'slide2.jpg'));
      client.waitForElementPresent(loadedImagesSelector);
      client.pause(2000); // TODO: rewrote to be able to wait for paranja
      client.waitForElementNotPresent(busyLayerSelector)
      client.click(selectImagesBtnSelector);
      // Timed out while waiting for element <[data-slideshow-item]>
      // to be present for 50000 milliseconds.  - expected "found" but got: "not found"
      client.waitForElementPresent(resultDraftSliderSelector, 80000);
      client.pause(1000); // TODO: rewrote to be able to wait for close paranja
    }
  },
  steps.submitChanges(),
  steps.checkSubmitted(['slide1', 'slide2',]),
  steps.commitAndExport(3),
  steps.makeIncognitoRequestByRelativeUrl((client, $) => {
    client.assert.ok($(slideshowSelector).length);
    client.assert.ok($(slideshow2nItemSelector).length);
  }),
  steps.switchLocale('fr'),
  steps.commit(3),
  steps.makeIncognitoRequestByRelativeUrl((client, $) => {
    client.assert.ok($(slideshowSelector).length);
    client.assert.ok($(slideshow2nItemSelector).length);
  }),
  steps.changePageTypeTo('Alternate Page'),
  {
    'check that images are present': function (client) {
      client.waitForElementVisible(slideshowSelector);

      client.expect.element(slideshowSelector).to.be.present;
      client.expect.element(slideshow2nItemSelector).to.be.present;
    },
  },
  steps.changePageTypeTo('Default Page'),
  {
    'check that images are still present': function (client) {
      client.waitForElementVisible(slideshowSelector);

      client.expect.element(slideshowSelector).to.be.present;
      client.expect.element(slideshow2nItemSelector).to.be.present;
    },
  },
);
