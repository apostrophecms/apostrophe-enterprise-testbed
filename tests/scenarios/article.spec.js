const server = require('../server');
const steps = require('../steps');

module.exports = Object.assign(
    {
    before: (client, done) => {
      console.log('client', client.globals.test_settings);
      const { apos_address, apos_port } = client.globals.test_settings;
      client.resizeWindow(1200, 800);

      this._server = server.create(apos_address, apos_port);
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
  steps.createArticle('New Article Title'),
  {
    'submit the article, via the "Workflow" menu in the dialog box': (client) => {
      const modalBlogSelector = '.apostrophe-blog-manager';
      const modalEditArticleSelector = '.apos-pieces-editor';
      const manageTableRowSelector = '.apos-manage-table tr[data-piece]';
      const editArticleBtnSelector = `${manageTableRowSelector} a`;
      const controlSelector = `${modalEditArticleSelector} .apos-modal-controls .apos-dropdown`;
      const workflowModalBtnSelector =
        `${modalEditArticleSelector} [data-apos-dropdown-name="workflow"]`;
      const submitWorkflowBtnSelector = `${modalEditArticleSelector} [data-apos-workflow-submit]`;

      client.waitForElementVisible(modalBlogSelector);
      client.waitForElementVisible(manageTableRowSelector);
      client.click(editArticleBtnSelector);
      client.waitForElementVisible(modalEditArticleSelector);
      client.waitForElementVisible(controlSelector);
      client.pause(1000);
      client.click(workflowModalBtnSelector);
      client.useCss();
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
      const controlSelector = `${modalEditArticleSelector} .apos-modal-controls .apos-dropdown`;
      const manageTableRowSelector = '.apos-manage-table tr[data-piece]';
      const editArticleBtnSelector = `${manageTableRowSelector} a`;
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
      client.waitForElementVisible(manageTableRowSelector);
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
  /*
  {
    'close export dialog': (client) => {
      const finishBtnSelector = '[data-apos-cancel]';
      const blackoutSelector = '.apos-modal-blackout';

      client.waitForElementVisible(finishBtnSelector);
      client.click(finishBtnSelector);
      client.waitForElementNotPresent(blackoutSelector);
    },
  },
  */
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
