const server = require('../server');
const steps = require('../steps');
const sauce = require('../sauce');
debugger;
module.exports = Object.assign(
    {
    before: (client, done) => {
      client.resizeWindow(1200, 800);
      if (!this._server) {
        this._server = server.create('localhost', 3112);
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
      const modalBlogSelector = '.apostrophe-blog-manager';
      const modalEditArticleSelector = '.apos-pieces-editor';
      const manageTableRowSelector = 'table[data-items] tr[data-piece]:first-child';
      const editArticleBtnSelector = `${manageTableRowSelector} .apos-manage-apostrophe-blog-title a`;
      const workflowModalBtnSelector =
        `${modalEditArticleSelector} [data-apos-dropdown-name="workflow"]`;
      const submitWorkflowBtnSelector = `${modalEditArticleSelector} [data-apos-workflow-submit]`;

      client.waitForElementVisible(modalBlogSelector);
      client.waitForElementVisible(manageTableRowSelector);
      client.waitForElementVisible(editArticleBtnSelector);
      client.click(editArticleBtnSelector);
      client.waitForElementVisible(workflowModalBtnSelector);
      client.click(workflowModalBtnSelector);
      client.waitForElementVisible(submitWorkflowBtnSelector);
      client.click(submitWorkflowBtnSelector);
      client.waitForElementNotPresent(modalEditArticleSelector);
    }
  },
  steps.openAdminBar(),
  {
    'reopen the article. Commit the article.': (client) => {
      const modalBlogSelector = '.apostrophe-blog-manager';
      const modalEditArticleSelector = '.apos-pieces-editor';
      const blogButtonSelector = '[data-apos-admin-bar-item="apostrophe-blog"]';
      const modalCommitSelector = '.apos-workflow-commit-modal';
      const manageTableRowSelector = 'table[data-items] tr[data-piece]:first-child';
      const editArticleBtnSelector = `${manageTableRowSelector} .apos-manage-apostrophe-blog-title a`;
      const workflowModalBtnSelector =
        `${modalEditArticleSelector} [data-apos-dropdown-name="workflow"]`;
      const commitWorkflowBtnSelector = `${modalEditArticleSelector} [data-apos-save]`;
      const noPreviewSelector = '.apos-workflow-no-preview';
      const notificationSelector = '.apos-notification-message';

      client.waitForElementVisible(blogButtonSelector);
      client.click(blogButtonSelector);
      client.waitForElementVisible(editArticleBtnSelector);
      client.click(editArticleBtnSelector);
      client.waitForElementVisible(workflowModalBtnSelector);
      client.click(workflowModalBtnSelector);
      client.waitForElementVisible(commitWorkflowBtnSelector);
      client.click(commitWorkflowBtnSelector);
      client.waitForElementNotPresent(commitWorkflowBtnSelector);
    }
  },
    steps.openAdminBar(),
  {
    'export the article to all other locales.': (client) => {
      const blogButtonSelector = '[data-apos-admin-bar-item="apostrophe-blog"]';
      const modalBlogSelector = '.apostrophe-blog-manager';
      const modalExportSelector = '.apos-workflow-export-modal';
      const exportBtnSelector = `${modalExportSelector} [data-apos-save]`;
      const workflowModalBtnSelector =
        `[data-apos-dropdown-name="workflow"]`;
      const masterLocaleBtnSelector = '[for*=master] span';
      const manageTableRowSelector = '.apos-manage-table tr[data-piece]';
      const editArticleBtnSelector = `${manageTableRowSelector} a`;
      const forceExportBtnSelector = `[data-apos-workflow-force-export]`;
      const notificationSelector = '.apos-notification-container';

      client.waitForElementVisible(blogButtonSelector);
      client.click(blogButtonSelector);
      client.waitForElementVisible(editArticleBtnSelector);
      client.click(editArticleBtnSelector);
      client.waitForElementVisible(workflowModalBtnSelector);
      client.click(workflowModalBtnSelector);
      client.waitForElementVisible(forceExportBtnSelector);
      client.click(forceExportBtnSelector);
      client.waitForElementVisible(masterLocaleBtnSelector);
      client.click(masterLocaleBtnSelector);
      client.click(exportBtnSelector);
      client.waitForElementNotPresent(modalExportSelector);
    }
  },
  steps.switchLocale('es'),
  steps.openAdminBar(),
  {
    'article can be found under "Articles" in draft mode for the es locale': (client) => {
      const blogButtonSelector = '[data-apos-admin-bar-item="apostrophe-blog"]';
      const modalBlogSelector = '.apostrophe-blog-manager';
      const manageTableRowSelector = '.apos-manage-table tr[data-piece]';

      client.click(blogButtonSelector);
      client.useCss();
      client.waitForElementVisible(modalBlogSelector);

      client.expect.element(manageTableRowSelector).text.to.contain('New Article Title');
      client.expect.element(manageTableRowSelector).text.to.contain('Published');
    }
  },
);
