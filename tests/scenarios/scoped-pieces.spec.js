// Test ability to use an npm module with a scoped module name
// as a piece type, for example `@scoped/pieces`. We create
// a folder in node_modules on the fly to avoid truly publishing
// something just for the sake of this test.

const server = require('apostrophe-nightwatch-tools/server');
const steps = require('apostrophe-nightwatch-tools/steps');
const rimraf = require('rimraf');
const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');

const root = path.dirname(path.dirname(__dirname));

module.exports = Object.assign(
  {
    before: (client, done) => {
      process.env.SCOPED_PIECES = '1';
      mkdirp.sync(`${root}/node_modules/@scoped/pieces`);
      fs.writeFileSync(`${root}/node_modules/@scoped/pieces/index.js`, fs.readFileSync(`${__dirname}/scoped-pieces/index.js`, 'utf8'));
      client.resizeWindow(1200, 1200);
      if (!this._server) {
        this._server = server.create('localhost', 3111);
        this._server.start(done);
      }
    },
    after: (client, done) => {
      delete process.env.SCOPED_PIECES;
      rimraf.sync(`${root}/node_modules/@scoped`);
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
    'Create a scoped piece': (client) => {
      const scopedPieceName = 'Sample Scoped Piece';
      const blackoutSelector = '.apos-modal-blackout:first-child';
      const scopedPieceSelector = '[data-apos-admin-bar-item="@scoped/pieces"]';
      const addScopedPieceBtnSelector = '[data-apos-create-scoped-piece]';
      const basicsTabSelector = '[data-apos-open-group=basics]';
      const inputTitleSelector = '.apos-field-title input';
      const selectPublishedSelector = '.apos-field-published select';
      const saveBtnSelector = '[data-apos-save]';
      const manageTableRowSelector = '.apos-manage-table tr[data-piece]';

      client.openAdminBarItem('@scoped/pieces');
      client.clickInModal('@scoped/pieces-manager-modal', addScopedPieceBtnSelector);
      client.clickInModal('@scoped/pieces-editor-modal', basicsTabSelector);
      client.resetValueInModal('@scoped/pieces-editor-modal', inputTitleSelector, scopedPieceName);
      client.resetValueInModal('@scoped/pieces-editor-modal', selectPublishedSelector, 'Yes');

      client.clickInModal('@scoped/pieces-editor-modal', saveBtnSelector);
      client.clickInModal('@scoped/pieces-manager-modal', '[data-apos-cancel]');
      client.waitForNoModals();
      client.openAdminBarItem('@scoped/pieces');
      client.waitForElementReady(manageTableRowSelector);
      client.expect.element(manageTableRowSelector).text.to.contain(scopedPieceName);
      client.expect.element(manageTableRowSelector).text.to.contain('Published');
      client.screenshot();
    }
  }
);

