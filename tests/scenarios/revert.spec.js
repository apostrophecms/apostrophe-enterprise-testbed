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
    }
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
      const editModalSelector = `${modalEditArticleSelector} .apos-schema-group-inner`;
      const editTitleField = `${editModalSelector} input[name=title]`;
      const saveBtnSelector = '[data-apos-save]';
      const commitWorkflowBtnSelector = `${modalEditArticleSelector} [data-apos-workflow-commit]`;
      const noPreviewSelector = '.apos-workflow-no-preview';
      const notificationSelector = '.apos-notification-message';
      const modalCommitSelector = '.apos-workflow-commit-modal';
      const aposCommitBtnSelector = `${modalCommitSelector} [data-apos-save]`;

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
    'pause': (client) => {
      client.pause()
    }
  },
  {
    'article can be found under "Articles" in draft mode with title: Article Title 1': (client) => {
      const blogBtnSelector = '[data-apos-admin-bar-item="apostrophe-blog"]';
      const blogTitleSelector = '.apos-manage-apostrophe-blog-title a';

      client.keys(client.Keys.ESCAPE);
      client.keys(client.Keys.ESCAPE);
      client.waitForElementVisible(blogBtnSelector);
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
      const managerSelector = '.apos-manage-table';
      const manageTableRowSelector = '.apos-manage-table tr[data-piece]';
      const editArticleBtnSelector = `${manageTableRowSelector} a`;
      const workflowModalBtnSelector =
        `${modalEditArticleSelector} [data-apos-dropdown-name="workflow"]`;
      const notificationSelector = '.apos-notification-container';
      const workflowHistoryBtnSelector = `[data-apos-dropdown-name=workflow] [data-apos-workflow-history]`;
      const workflowRevertBtnSelector = ('.apos-manage-table tr:last-child td [data-apos-workflow-revert]');

      client.waitForElementNotPresent(modalExportSelector);
      client.waitForElementVisible(modalBlogSelector);
      client.waitForElementVisible(manageTableRowSelector);
      client.click(editArticleBtnSelector);
      client.waitForElementVisible(modalEditArticleSelector);
      client.click(workflowModalBtnSelector);
      client.waitForElementVisible(workflowHistoryBtnSelector);
      client.click(workflowHistoryBtnSelector);
      client.waitForElementVisible(managerSelector);
      client.waitForElementVisible(workflowRevertBtnSelector);
      client.click(workflowRevertBtnSelector);
      client.waitForElementNotVisible(notificationSelector);
    }
  },
  {
    'article can be found under "Articles" in draft mode with title: New Article Title': (client) => {
      const blogBtnSelector = '[data-apos-admin-bar-item="apostrophe-blog"]';
      const blogTitleSelector = '.apos-manage-apostrophe-blog-title a';
      const notificationSelector = '.apos-notification-container';

      client.keys(client.Keys.ESCAPE);
      client.keys(client.Keys.ESCAPE);
      client.pause(500);
      client.acceptAlert();
      client.waitForElementVisible(notificationSelector);
      client.click(notificationSelector);
      client.waitForElementNotVisible(notificationSelector);
      client.waitForElementVisible(blogBtnSelector);
      client.click(blogBtnSelector);
      client.waitForElementVisible(blogTitleSelector);
      client.expect.element(blogTitleSelector).text.to.equal('New Article Title');
    }
  }
);
