const steps = require('../steps');
const server = require('../server');

module.exports = Object.assign(
  {
    before: (client, done) => {
      const address = client.globals.test_settings.apos_address;
      const port = client.globals.test_settings.apos_port;
      client.resizeWindow(1200, 800);

      this._server = server.create(address, port);
      this._server.start(done);
    },
    afterEach: (client, done) => {
      return sauce(client, done);
    },
    after: (client, done) => {
      client.end(() => {
        server.clean();
        this._server.stop(done);
      });
    }
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
  steps.checkNotification('Your submission will be reviewed.'),
  {
    'reopen the article. Commit the article.': (client) => {
      const modalBlogSelector = '.apostrophe-blog-manager';
      const modalEditArticleSelector = '.apos-pieces-editor';
      const modalCommitSelector = '.apos-workflow-commit-modal';
      const controlSelector = `${modalEditArticleSelector} .apos-modal-controls .apos-dropdown`;
      const manageTableRowSelector = '.apos-manage-table tr[data-piece]';
      const editArticleBtnSelector = `${manageTableRowSelector} a`;
      const workflowModalBtnSelector =
        `${modalEditArticleSelector} [data-apos-dropdown-name="workflow"]`;
      const commitWorkflowBtnSelector = `${modalEditArticleSelector} [data-apos-workflow-commit]`;
      const noPreviewSelector = '.apos-workflow-no-preview';
      const saveBtnSelector = `${modalCommitSelector} [data-apos-save]`;
      const notificationSelector = '.apos-notification-message';

      client.waitForElementVisible(modalBlogSelector);
      client.waitForElementVisible(manageTableRowSelector);
      client.click(editArticleBtnSelector);
      client.waitForElementVisible(modalEditArticleSelector);
      client.waitForElementVisible(controlSelector);
      client.pause(200);
      client.click(workflowModalBtnSelector);
      client.useCss();
      client.waitForElementVisible(commitWorkflowBtnSelector);
      client.click(commitWorkflowBtnSelector);
      client.waitForElementVisible(noPreviewSelector);

      client.expect.element(noPreviewSelector).text.to.equal('No preview available.');

      client.waitForElementNotPresent(notificationSelector);
      client.click(saveBtnSelector);
    }
  },
  steps.checkNotification('New Article Title was committed successfully.'),
  {
    'export the article to all other locales.': (client) => {
      const modalExportSelector = '.apos-workflow-export-modal';
      const exportBtnSelector = `${modalExportSelector} [data-apos-save]`;
      const masterLocaleBtnSelector = '[for*=master] span';
      const notificationSelector = '.apos-notification-container';

      client.waitForElementVisible(modalExportSelector);
      client.waitForElementVisible(masterLocaleBtnSelector);
      client.click(masterLocaleBtnSelector);
      client.click(notificationSelector);
      client.click(exportBtnSelector);
      client.waitForElementNotPresent(modalExportSelector);
    }
  },
  steps.checkNotification('Successfully exported to: master, fr, es'),
  {
    'close export dialog': (client) => {
      const finishBtnSelector = '[data-apos-cancel]';
      const blackoutSelector = '.apos-modal-blackout';

      client.waitForElementVisible(finishBtnSelector);
      client.pause(1000);
      client.click(finishBtnSelector);
      client.waitForElementNotPresent(blackoutSelector);
    },
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
