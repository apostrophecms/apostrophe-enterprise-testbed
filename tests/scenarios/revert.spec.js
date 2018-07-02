const steps = require('apostrophe-nightwatch-tools/steps');
const server = require('apostrophe-nightwatch-tools/server');

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
  steps.workflowSubmitArticle(),
  steps.workflowCommitArticle(),
  {
    "change title and commit": (client) => {
      const manageTableRowSelector = '.apos-manage-table tr[data-piece]';
      const editArticleBtnSelector = `${manageTableRowSelector} a`;
      const workflowModalBtnSelector = '[data-apos-dropdown-name="workflow"]';
      const editTitleField = 'input[name=title]';
      const saveBtnSelector = '[data-apos-save]';
      const commitWorkflowBtnSelector = '[data-apos-workflow-commit]';

      client.clickInModal('apostrophe-blog-manager-modal', editArticleBtnSelector);
      client.resetValueInModal('apostrophe-blog-editor-modal', editTitleField, 'Article Title 1');
      client.clickInModal('apostrophe-blog-editor-modal', saveBtnSelector);
      client.clickInModal('apostrophe-blog-manager-modal', '[data-apos-cancel]');
      client.openAdminBarItem('apostrophe-blog');
      client.clickInModal('apostrophe-blog-manager-modal', editArticleBtnSelector);
      client.clickInModal('apostrophe-blog-editor-modal', workflowModalBtnSelector);
      client.clickInModal('apostrophe-blog-editor-modal', commitWorkflowBtnSelector);
      client.clickInModal('apostrophe-workflow-commit-modal', '[data-apos-save]');
      client.clickInModal('apostrophe-workflow-export-modal', '[data-apos-cancel]');
      client.clickInModal('apostrophe-blog-manager-modal', '[data-apos-cancel]');
      client.waitForNoModals();
    }
  },
  {
    'article can be found under "Articles" in draft mode with title: Article Title 1': (client) => {
      const blogTitleSelector = '.apos-manage-apostrophe-blog-title a';
      client.openAdminBarItem('apostrophe-blog');
      client.waitForElementReady(blogTitleSelector);
      client.expect.element(blogTitleSelector).text.to.equal('Article Title 1');
      client.clickInModal('apostrophe-blog-manager-modal', '[data-apos-cancel]');
      client.waitForNoModals();
    }
  },
  {
    'revert to initial version': (client) => {
      const manageTableRowSelector = '.apos-manage-table tr[data-piece]';
      const editArticleBtnSelector = `${manageTableRowSelector} a`;
      const workflowModalBtnSelector =
        `[data-apos-dropdown-name="workflow"]`;
      const workflowHistoryBtnSelector = `[data-apos-dropdown-name=workflow] [data-apos-workflow-history]`;
      const workflowRevertBtnSelector = ('.apos-manage-table tr:last-child td [data-apos-workflow-revert]');

      client.openAdminBarItem('apostrophe-blog');

      client.clickInModal('apostrophe-blog-manager-modal', editArticleBtnSelector);
      client.clickInModal('apostrophe-blog-editor-modal', workflowModalBtnSelector);
      client.clickInModal('apostrophe-blog-editor-modal', workflowHistoryBtnSelector);
      client.clickInModal('apostrophe-workflow-history-modal', workflowRevertBtnSelector);
      client.clickInModal('apostrophe-workflow-history-modal', '[data-apos-cancel]');
      client.clickInModal('apostrophe-blog-editor-modal', '[data-apos-cancel]');
      client.pause(1000);
      client.acceptAlert();
      client.pause(1000);
      client.clickInModal('apostrophe-blog-manager-modal', '[data-apos-cancel]');
      client.waitForNoModals();
    }
  },
  {
    'article can be found under "Articles" in draft mode with title: New Article Title': (client) => {
      const blogTitleSelector = '.apos-manage-apostrophe-blog-title a';

      client.openAdminBarItem('apostrophe-blog');
      client.waitForElementReady(blogTitleSelector);
      client.expect.element(blogTitleSelector).text.to.equal('New Article Title');
      client.categoryScreenshot('revert.png');
      client.clickInModal('apostrophe-blog-manager-modal', '[data-apos-cancel]');
      client.waitForNoModals();
    }
  },
);
