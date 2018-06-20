const server = require('../server');
const steps = require('../steps');
const sauce = require('../sauce');
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
  steps.createArticle('New Article Title'),
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
    }
  },
);
