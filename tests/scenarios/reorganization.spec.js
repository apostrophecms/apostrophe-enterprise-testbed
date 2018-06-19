const server = require('../server');
const steps = require('../steps');
const sauce = require('../sauce');

const firstTreeItem = 'ul.jqtree-tree ul.jqtree_common li.jqtree_common:nth-child(1)';
const sendTreeItem = 'ul.jqtree-tree ul.jqtree_common li.jqtree_common:nth-child(2)';
const trashSelector = 'ul.jqtree-tree ul.jqtree_common .apos-trash';
const secondMenuItemSelector = 'header .demo-nav li:nth-child(2)';
const thirdMenuItemSelector = 'header .demo-nav li:nth-child(3)';

function dragAndDrop(client, draggable, droppable) {
  client.moveToElement(
    draggable.selector,
    draggable.xOffset || 0,
    draggable.yOffset || 0
  );
  client.mouseButtonDown(0);
  client.pause(500);
  client.moveToElement(
    droppable.selector,
    droppable.xOffset || 0,
    droppable.yOffset || 0
  );
  client.pause(500);
  client.mouseButtonUp(0);
  client.clickWhenReady('[data-apos-save]');
  client.waitForElementNotPresent('.apos-modal');
  client.pause(500);
}

module.exports = Object.assign(
  {
    before: (client, done) => {
      client.resizeWindow(1200, 800);
      if (!this._server) {
        this._server = server.create('localhost', 3111);
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
  steps.makeSubPage('test1'),
  steps.commit(),
  steps.navigateToHome(),
  steps.makeSubPage('test2'),
  steps.commit(),
  steps.navigateToHome(),
  steps.openContextMenu('Reorganize'),
  {
    'resort pages': function(client) {
      client.expect.element(secondMenuItemSelector).text.to.contain('test1');
      client.expect.element(thirdMenuItemSelector).text.to.contain('test2');

      dragAndDrop(
        client,
        {selector: firstTreeItem},
        {selector: trashSelector, yOffset: -1},
      );

      client.expect.element(secondMenuItemSelector).text.to.contain('test2');
      client.expect.element(thirdMenuItemSelector).text.to.contain('test1');
    },
  },
  steps.openContextMenu('Reorganize'),
  {
    'move page to trash': function(client) {
      dragAndDrop(
        client,
        {selector: sendTreeItem},
        {selector: trashSelector, yOffset: 1},
      );

      client.expect.element(secondMenuItemSelector).text.to.contain('test2');
      client.expect.element(thirdMenuItemSelector).to.not.be.present;
    },
  },
  steps.makeIncognitoRequestByRelativeUrl((client, $) => {
    const menuItems = $('header .demo-nav li a');

    client.assert.equal(menuItems.length, 3);
    client.assert.equal(menuItems.eq(0).text(), 'Home');
    client.assert.equal(menuItems.eq(1).text(), 'test2');
    client.assert.equal(menuItems.eq(2).text(), 'test1');
  }),
  steps.navigateToRelativeUrlAndconfirm404('test1'),
  steps.navigateToHome(),
  steps.openContextMenu('Reorganize'),
  {
    'put back from trash': function(client) {
      const trachTogglerSelector = '.apos-trash .jqtree-toggler';
      const firstItemInTrash = '.apos-trash ul li:nth-child(1)';

      client.clickWhenReady(trachTogglerSelector);

      dragAndDrop(
        client,
        {selector: firstItemInTrash},
        {selector: firstTreeItem, yOffset: -1},
      );

      client.expect.element(secondMenuItemSelector).text.to.contain('test2');
      client.expect.element(thirdMenuItemSelector).text.to.contain('test1');
    },
  },
  steps.navigateToRelativeUrlAndconfirm200('test1'),
);
