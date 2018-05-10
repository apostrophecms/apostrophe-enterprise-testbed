const server = require('../server');
const steps = require('../steps');

module.exports = Object.assign(
  {
    before: (client, done) => {
      const address = client.globals.test_settings.apos_address;
      const port = client.globals.test_settings.apos_port;
      console.log("REVERT", address, port);
      client.resizeWindow(1200, 800);

      this._server = server.create(address, port);
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
 /* { */
 /*    'pause': client => { */
 /*      client.pause(); */
 /*    } */
 /*  }, */
  steps.switchLocale('en'),
  steps.switchToDraftMode(),
  steps.createArticle('New Article Title'),
  steps.workflowSubmitArticle(),
  steps.workflowCommitArticle(),
  {
    "change title and commit": (client) => {
      const modalExportSelector = '.apos-workflow-export-modal';
      const exportSkipSelector = '.apos-workflow-commit-modal [data-apos-cancel]';
      const modalBlogSelector = '.apostrophe-blog-manager';
      const modalEditArticleSelector = '.apos-pieces-editor';
      const manageTableRowSelector = '.apos-manage-table tr[data-piece]';
      const adminBarSelector = '[data-apos-admin-bar-logo]';
      const articleSelector = '[data-apos-admin-bar-item="apostrophe-blog"]';
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
       client.keys(client.Keys.ESCAPE);

      // edit article and update title
      client.waitForElementNotVisible(articleSelector);
      client.waitForElementVisible(adminBarSelector);
      client.click(adminBarSelector);
      client.waitForElementVisible(articleSelector);
      client.click(articleSelector);
      client.waitForElementVisible(editArticleBtnSelector);
      client.click(editArticleBtnSelector);
      client.waitForElementVisible(editTitleField);
      client.clearValue(editTitleField);
      client.setValue(editTitleField, 'Article Title 1');
      client.click(saveBtnSelector);

      client.waitForElementVisible(adminBarSelector);
      client.click(adminBarSelector);
      client.waitForElementVisible(articleSelector);
      client.click(articleSelector);

      // commit the updated article
      client.waitForElementVisible(editArticleBtnSelector);
      client.click(editArticleBtnSelector);
      client.waitForElementVisible(modalEditArticleSelector);
      client.click(workflowModalBtnSelector);
      client.waitForElementVisible(commitWorkflowBtnSelector);
      client.click(commitWorkflowBtnSelector);
      client.waitForElementVisible(".demo-blog-header-wrapper h3");
      client.expect.element(".demo-blog-header-wrapper h3").text.to.equal('Article Title 1');
      client.waitForElementVisible(aposCommitBtnSelector);
      client.click(aposCommitBtnSelector);
      client.waitForElementVisible(modalExportSelector);
      client.waitForElementVisible(exportSkipSelector);
      client.click(exportSkipSelector);
    }
  },
  {
    'article can be found under "Articles" in draft mode with title: Article Title 1': (client) => {
      const adminBarSelector = '[data-apos-admin-bar-logo]';
      const blogBtnSelector = '[data-apos-admin-bar-item="apostrophe-blog"]';
      const blogTitleSelector = '.apos-manage-apostrophe-blog-title a';

      client.keys(client.Keys.ESCAPE);
      client.keys(client.Keys.ESCAPE);
      client.waitForElementNotVisible(blogBtnSelector);
      client.click(adminBarSelector);
      client.waitForElementVisible(blogBtnSelector);
      client.click(blogBtnSelector);
      client.waitForElementVisible(blogTitleSelector);
      client.expect.element(blogTitleSelector).text.to.equal('Article Title 1');
    }
  },
  {
    'revert to initial version': (client) => {
      const adminBarSelector = '[data-apos-admin-bar-logo]';
      const articleSelector = '[data-apos-admin-bar-item="apostrophe-blog"]';
      const modalExportSelector = '.apos-workflow-export-modal';
      const modalBlogSelector = '.apostrophe-blog-manager';
      const modalEditArticleSelector = '.apos-pieces-editor';
      const managerSelector = '.apos-manage-table';
      const manageTableRowSelector = '.apos-manage-table tr[data-piece]';
      const editArticleBtnSelector = `${manageTableRowSelector} a`;
      const workflowModalBtnSelector = '[data-apos-dropdown-name="workflow"]';
      const notificationSelector = '.apos-notification-container';
      const workflowHistoryBtnSelector = `[data-apos-dropdown-name=workflow] [data-apos-workflow-history]`;
      const workflowRevertBtnSelector = ('.apos-manage-table tr:last-child td [data-apos-workflow-revert]');

      client.waitForElementNotPresent(modalExportSelector);

      client.waitForElementVisible(articleSelector);
      client.click(articleSelector);

      client.waitForElementVisible(editArticleBtnSelector);
      client.click(editArticleBtnSelector);
      client.waitForElementVisible(workflowModalBtnSelector);
      client.click(workflowModalBtnSelector);
      client.waitForElementVisible(workflowHistoryBtnSelector);
      client.click(workflowHistoryBtnSelector);
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
      client.waitForElementVisible(blogBtnSelector);
      client.click(blogBtnSelector);
      client.waitForElementVisible(blogTitleSelector);
      client.expect.element(blogTitleSelector).text.to.equal('New Article Title');
    }
  }
);
