const server = require('apostrophe-nightwatch-tools/server');
const steps = require('apostrophe-nightwatch-tools/steps');
debugger;
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
  steps.createArticle('New Article Title'),
  {
let counter = 0;

function castTwoDigits(val) {
  return ('0' + val).slice(-2);
}

module.exports = (articleName) => {
  counter++;

  return {
    'create a group': (client) => {
      const addArticleBtnSelector = '[data-apos-create-group]';
      const basicsTabSelector = '[data-apos-open-group=basic]';
      const inputTitleSelector = '.apos-field-title input';
      const selectPublishedSelector = '.apos-field-published select';
      const inputPublicationDateSelector = '.apos-field-date input';
      const metaTabSelector = '[data-apos-open-group=meta]';
      const infoTabSelector = '[data-apos-open-group=default]';
      const saveBtnSelector = '[data-apos-save]';
      const manageTableRowSelector = '.apos-manage-table tr[data-piece]';

      client.openAdminBarItem('apostrophe-groups');
      client.clickInModal('apostrophe-groups-manager-modal', '[data-apos-create-group]');
      client.clickInModal('apostrophe-groups-editor-modal', '[data-apos-open-group=basic]');
      client.resetValueInModal('apostrophe-groups-editor-modal', inputTitleSelector, 'test-group');
      client.clickInModal('apostrophe-blog-editor-modal', '[data-apos-open-group=permissions]');
      client.clickInModal('apostrophe-blog-editor-modal', '[name="guest"]');
      client.clickInModal('apostrophe-blog-editor-modal', '[name="private-locales"]');
      client.clickInModal('apostrophe-blog-editor-modal', '[name="edit-attachment"]');
      client.clickInModal('apostrophe-blog-editor-modal', '[name="permissionsLocales[en]"] [value="commit"]');
      client.clickInModal('apostrophe-blog-editor-modal', '[name="insert-apostrophe-page"]');

      const currentDate = new Date();
      const day = castTwoDigits(currentDate.getDate());
      const month = castTwoDigits(currentDate.getMonth()+1);
      const year = currentDate.getFullYear();
      const publicationDate = `${year}-${month}-${day}`;

      client.resetValueInModal('apostrophe-blog-editor-modal', inputPublicationDateSelector, publicationDate);
      client.clickInModal('apostrophe-blog-editor-modal', saveBtnSelector);
      client.clickInModal('apostrophe-blog-manager-modal', '[data-apos-cancel]');
      client.waitForNoModals();
      client.openAdminBarItem('apostrophe-blog');
      client.waitForElementReady(manageTableRowSelector);
      client.expect.element(manageTableRowSelector).text.to.contain(articleName);
      client.expect.element(manageTableRowSelector).text.to.contain('Published');
      client.expect.element(manageTableRowSelector).text.to.contain(publicationDate);
      client.screenshot();
    }
  };
};
  {
    'reopen the article. Set value for dynamic choices.': (client) => {
      const manageTableRowSelector = 'table[data-items] tr[data-piece]:first-child';
      const editArticleBtnSelector = `${manageTableRowSelector} .apos-manage-apostrophe-blog-title a`;
      const dynamicSelectSelector = '[name="dynamicSelect"]';
      const saveBtnSelector = '[data-apos-save]';
      client.clickInModal('apostrophe-blog-manager-modal', editArticleBtnSelector);
      client.resetValueInModal('apostrophe-blog-editor-modal', dynamicSelectSelector, 'Item 5');
      client.expect.element(manageTableRowSelector).text.to.contain('New Article Title');
      client.clickInModal('apostrophe-blog-editor-modal', '[name="dynamicCheckboxes"][value="3"] + .apos-form-checkbox-indicator');
      client.clickInModal('apostrophe-blog-editor-modal', '[name="dynamicCheckboxes"][value="4"] + .apos-form-checkbox-indicator');
      client.clickInModal('apostrophe-blog-editor-modal', saveBtnSelector);
      client.waitForModal('apostrophe-blog-manager-modal');
    }
  },
  {
    'reopen the article. Verify values for dynamic choices stuck.': (client) => {
      const manageTableRowSelector = 'table[data-items] tr[data-piece]:first-child';
      const editArticleBtnSelector = `${manageTableRowSelector} .apos-manage-apostrophe-blog-title a`;
      const dynamicSelectSelector = '[name="dynamicSelect"]';
      const saveBtnSelector = '[data-apos-save]';
      client.clickInModal('apostrophe-blog-manager-modal', editArticleBtnSelector);
      client.waitForElementReady(dynamicSelectSelector);
      client.expect.element(dynamicSelectSelector).to.have.value.that.equals('5');
      // client.moveToElement('[name="dynamicCheckboxes"][value="4"] + .apos-form-checkbox-indicator');
      client.expect.element('[name="dynamicCheckboxes"][value="2"]').to.not.be.selected;
      client.expect.element('[name="dynamicCheckboxes"][value="3"]').to.be.selected;
      client.expect.element('[name="dynamicCheckboxes"][value="4"]').to.be.selected;
      client.clickInModal('apostrophe-blog-editor-modal', saveBtnSelector);
      client.waitForModal('apostrophe-blog-manager-modal');
    }
  },
  {
    'submit the article, via the "Workflow" menu in the dialog box': (client) => {
      const manageTableRowSelector = 'table[data-items] tr[data-piece]:first-child';
      const editArticleBtnSelector = `${manageTableRowSelector} .apos-manage-apostrophe-blog-title a`;
      const workflowModalBtnSelector =
        `[data-apos-dropdown-name="workflow"]`;
      const submitWorkflowBtnSelector = `[data-apos-workflow-submit]`;

      client.clickInModal('apostrophe-blog-manager-modal', editArticleBtnSelector);
      client.clickInModal('apostrophe-blog-editor-modal', workflowModalBtnSelector);
      client.clickInModal('apostrophe-blog-editor-modal', submitWorkflowBtnSelector);
      client.waitForModal('apostrophe-blog-manager-modal');
    }
  },
  {
    'reopen the article. Commit the article.': (client) => {
      const manageTableRowSelector = 'table[data-items] tr[data-piece]:first-child';
      const editArticleBtnSelector = `${manageTableRowSelector} .apos-manage-apostrophe-blog-title a`;
      const workflowModalBtnSelector =
        `[data-apos-dropdown-name="workflow"]`;
      const commitBtnSelector = `[data-apos-workflow-commit]`;
      const commitWorkflowBtnSelector = `[data-apos-save]`;

      client.clickInModal('apostrophe-blog-manager-modal', editArticleBtnSelector);
      client.clickInModal('apostrophe-blog-editor-modal', workflowModalBtnSelector);
      client.clickInModal('apostrophe-blog-editor-modal', commitBtnSelector);
      client.clickInModal('apostrophe-workflow-commit-modal', commitWorkflowBtnSelector);
      client.clickInModal('apostrophe-workflow-export-modal', '[data-apos-cancel]');
      client.waitForModal('apostrophe-blog-manager-modal');
    }
  },
  {
    'force export the article to all other locales.': (client) => {
      const exportBtnSelector = `[data-apos-save]`;
      const workflowModalBtnSelector =
        `[data-apos-dropdown-name="workflow"]`;
      const masterLocaleBtnSelector = '[for*=master] span';
      const manageTableRowSelector = '.apos-manage-table tr[data-piece]';
      const editArticleBtnSelector = `${manageTableRowSelector} a`;
      const forceExportBtnSelector = `[data-apos-workflow-force-export]`;
      const notificationSelector = '.apos-notification-container';

      client.clickInModal('apostrophe-blog-manager-modal', editArticleBtnSelector);
      client.clickInModal('apostrophe-blog-editor-modal', workflowModalBtnSelector);
      client.clickInModal('apostrophe-blog-editor-modal', forceExportBtnSelector);
      client.clickInModal('apostrophe-workflow-force-export-modal', masterLocaleBtnSelector);
      client.clickInModal('apostrophe-workflow-force-export-modal', exportBtnSelector);
      client.waitForModal('apostrophe-blog-manager-modal');
      client.clickInModal('apostrophe-blog-manager-modal', '[data-apos-cancel]');
      client.waitForNoModals();
    }
  },
  steps.switchLocale('es'),
  {
    'article can be found under "Articles" in draft mode for the es locale': (client) => {
      const manageTableRowSelector = '.apos-manage-table tr[data-piece]';

      client.openAdminBarItem('apostrophe-blog');
      client.waitForModal('apostrophe-blog-manager-modal');

      client.expect.element(manageTableRowSelector).text.to.contain('New Article Title');
      client.expect.element(manageTableRowSelector).text.to.contain('Published');
      client.categoryScreenshot('article.png');
    }
  },
);
