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
      const modalBlogSelector = '.apostrophe-blog-manager';
      const modalEditArticleSelector = '.apos-pieces-editor';
      const manageTableRowSelector = 'table[data-items] tr[data-piece]:first-child';
      const editArticleBtnSelector = `${manageTableRowSelector} .apos-manage-apostrophe-blog-title a`;
      const workflowModalBtnSelector =
        `${modalEditArticleSelector} [data-apos-dropdown-name="workflow"]`;
      const submitWorkflowBtnSelector = `${modalEditArticleSelector} [data-apos-workflow-submit]`;

      client.waitForElementReady(modalBlogSelector);
      client.waitForElementReady(manageTableRowSelector);
      client.waitForElementReady(editArticleBtnSelector);
      client.clickWhenReady(editArticleBtnSelector);
      client.waitForElementReady(workflowModalBtnSelector);
      client.clickWhenReady(workflowModalBtnSelector);
      client.waitForElementReady(submitWorkflowBtnSelector);
      client.clickWhenReady(submitWorkflowBtnSelector);
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

      client.waitForElementReady(blogButtonSelector);
      client.clickWhenReady(blogButtonSelector);
      client.waitForElementReady(editArticleBtnSelector);
      client.clickWhenReady(editArticleBtnSelector);
      client.waitForElementReady(workflowModalBtnSelector);
      client.clickWhenReady(workflowModalBtnSelector);
      client.waitForElementReady(commitWorkflowBtnSelector);
      client.clickWhenReady(commitWorkflowBtnSelector);
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

      client.waitForElementReady(blogButtonSelector);
      client.clickWhenReady(blogButtonSelector);
      client.waitForElementReady(editArticleBtnSelector);
      client.clickWhenReady(editArticleBtnSelector);
      client.waitForElementReady(workflowModalBtnSelector);
      client.clickWhenReady(workflowModalBtnSelector);
      client.waitForElementReady(forceExportBtnSelector);
      client.clickWhenReady(forceExportBtnSelector);
      client.waitForElementReady(masterLocaleBtnSelector);
      client.clickWhenReady(masterLocaleBtnSelector);
      client.clickWhenReady(exportBtnSelector);
      client.waitForElementNotPresent(modalExportSelector);
      client.waitForElementReady(editArticleBtnSelector);
      client.clickWhenReady('[data-apos-cancel]');
      client.waitForElementNotPresent(modalBlogSelector);
    }
  },
  steps.switchLocale('es'),
  steps.openAdminBar(),
  {
    'article can be found under "Articles" in draft mode for the es locale': (client) => {
      const blogButtonSelector = '[data-apos-admin-bar-item="apostrophe-blog"]';
      const modalBlogSelector = '.apostrophe-blog-manager';
      const manageTableRowSelector = '.apos-manage-table tr[data-piece]';

      client.clickWhenReady(blogButtonSelector);
      client.useCss();
      client.waitForElementReady(modalBlogSelector);

      client.expect.element(manageTableRowSelector).text.to.contain('New Article Title');
      client.expect.element(manageTableRowSelector).text.to.contain('Published');
    }
  },
);
