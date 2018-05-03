const server = require('../server');
const steps = require('../steps');

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
  steps.createArticle('New Article Title'),
  steps.workflowSubmitArticle(),
  steps.checkNotification('Your submission will be reviewed.'),
  steps.workflowCommitArticle(),
  steps.checkNotification('New Article Title was committed successfully.'),
  {
    "change title and commit": (client) => {
      const modalExportSelector = '.apos-workflow-export-modal';
      const exportSkipSelector = `${modalExportSelector} [data-apos-cancel]`;
      const modalBlogSelector = '.apostrophe-blog-manager';
      const modalEditArticleSelector = '.apos-pieces-editor';
      const manageTableRowSelector = '.apos-manage-table tr[data-piece]';
      const editArticleBtnSelector = `${manageTableRowSelector} a`;
      const workflowModalBtnSelector =
        `${modalEditArticleSelector} [data-apos-dropdown-name="workflow"]`;
      const submitWorkflowBtnSelector = `${modalEditArticleSelector} [data-apos-workflow-submit]`;
      const editModalSelector = `${modalEditArticleSelector} .apos-schema-group-inner`;
      const editTitleField = `${editModalSelector} input[name=title]`;
      const saveBtnSelector = '[data-apos-save]';
      const commitWorkflowBtnSelector = `${modalEditArticleSelector} [data-apos-workflow-commit]`;
      const noPreviewSelector = '.apos-workflow-no-preview';
      const notificationSelector = '.apos-notification-message';
      const modalCommitSelector = '.apos-workflow-commit-modal';
      const aposCommitBtnSelector = `${modalCommitSelector} [data-apos-save]`;
      const workflowHistoryBtnSelector = `[data-apos-dropdown-name=workflow] [data-apos-workflow-history]`

      // bail out from last commit's export window
      client.waitForElementVisible(exportSkipSelector);
      client.click(exportSkipSelector);

      // edit article and update title
      client.waitForElementNotPresent(modalExportSelector);
      client.waitForElementVisible(modalBlogSelector);
      client.waitForElementVisible(manageTableRowSelector);
      client.waitForElementVisible(editArticleBtnSelector);
      client.click(editArticleBtnSelector);
      client.waitForElementVisible(editModalSelector);
      client.clearValue(editTitleField);
      client.setValue(editTitleField, 'Article Title 1');
      client.click(saveBtnSelector);
      client.waitForElementVisible(modalBlogSelector);
      client.waitForElementVisible(editModalSelector);
      client.waitForElementNotPresent(notificationSelector);

      // commit the updated article
      client.click(editArticleBtnSelector);
      client.waitForElementVisible(modalEditArticleSelector);
      client.click(workflowModalBtnSelector);
      client.waitForElementVisible(commitWorkflowBtnSelector);
      client.click(commitWorkflowBtnSelector);
      client.waitForElementVisible(noPreviewSelector);
      client.expect.element(noPreviewSelector).text.to.equal('No preview available.');
      client.waitForElementVisible(aposCommitBtnSelector);
      client.click(aposCommitBtnSelector);
      client.waitForElementVisible(modalExportSelector);
      client.waitForElementVisible(exportSkipSelector);
      client.click(exportSkipSelector);
      client.waitForElementNotPresent(notificationSelector);
    }
  },
  {
    'article can be found under "Articles" in draft mode with title: Article Title 1': (client) => {
      const blogBtnSelector= '[data-apos-admin-bar-item="apostrophe-blog"]';
      const manageTableRowSelector = '.apos-manage-table tr[data-piece]';
      const blogTitleSelector = '.apos-manage-apostrophe-blog-title a';
      const modalBlogSelector = '.apostrophe-blog-manager';
      client.keys(client.Keys.ESCAPE);
      client.keys(client.Keys.ESCAPE);
      client.waitForElementVisible(blogBtnSelector);
      client.pause(200);
      client.click(blogBtnSelector);
      client.waitForElementVisible(blogTitleSelector);
      client.expect.element(blogTitleSelector).text.to.equal('Article Title 1');
    }
  },
  {
    'revert to initial version': (client) => {
      const modalExportSelector = '.apos-workflow-export-modal';
      const modalBlogSelector = '.apostrophe-blog-manager';
      const modalEditArticleSelector = '.apos-pieces-editor';
      const manageTableRowSelector = '.apos-manage-table tr[data-piece]';
      const editArticleBtnSelector = `${manageTableRowSelector} a`;
      const workflowModalBtnSelector =
        `${modalEditArticleSelector} [data-apos-dropdown-name="workflow"]`;
      const editModalSelector = `${modalEditArticleSelector} .apos-schema-group-inner`;
      const notificationSelector = '.apos-notification-container';
      const workflowHistoryBtnSelector = `[data-apos-dropdown-name=workflow] [data-apos-workflow-history]`
      // now revert to previous version
      client.waitForElementNotPresent(modalExportSelector);
      client.waitForElementVisible(modalBlogSelector);
      client.waitForElementVisible(manageTableRowSelector);
      client.click(editArticleBtnSelector);
      client.waitForElementVisible(modalEditArticleSelector);
      client.click(workflowModalBtnSelector);
      client.waitForElementVisible(workflowHistoryBtnSelector);
      client.click(workflowHistoryBtnSelector);
      client.waitForElementVisible('.apos-manage-table');
      client.waitForElementVisible('.apos-manage-table tr:last-child td [data-apos-workflow-revert]');
      // TODO assert there are two rows
      client.click('.apos-manage-table tr:last-child td [data-apos-workflow-revert]');
      client.waitForNotElementVisible(notificationSelector);
    }
  },
  {
    'article can be found under "Articles" in draft mode with new title': (client) => {
      const blogBtnSelector = '[data-apos-admin-bar-item="apostrophe-blog"]';
      const modalBlogSelector = '.apostrophe-blog-manager';
      const manageTableRowSelector = '.apos-manage-table tr[data-piece]';
      client.keys(client.Keys.ESCAPE);
      client.pause(200);
      client.click(blogBtnSelector);
      client.waitForElementVisible(modalBlogSelector);
      client.expect.element(manageTableRowSelector).text.to.contain('New Article Title');
      client.expect.element(manageTableRowSelector).text.to.contain('Published');
    }
  },
);
