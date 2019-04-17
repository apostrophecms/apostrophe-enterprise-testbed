const server = require('apostrophe-nightwatch-tools/server');
const steps = require('apostrophe-nightwatch-tools/steps');
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
  steps.createArticle('Apostrophe Workflow Modified Document Article Title'),
  {
    'submit an article, via the "Workflow" menu in the dialog box': (client) => {
      const manageTableRowSelector = 'table[data-items] tr[data-piece]:first-child';
      const editArticleBtnSelector = `${manageTableRowSelector} .apos-manage-apostrophe-blog-title a`;
      const workflowModalBtnSelector = `[data-apos-dropdown-name="workflow"]`;
      const submitWorkflowBtnSelector = `[data-apos-workflow-submit]`;

      client.clickInModal('apostrophe-blog-manager-modal', editArticleBtnSelector);
      client.clickInModal('apostrophe-blog-editor-modal', workflowModalBtnSelector);
      client.clickInModal('apostrophe-blog-editor-modal', submitWorkflowBtnSelector);
      client.waitForModal('apostrophe-blog-manager-modal');
      client.clickInModal('apostrophe-blog-manager-modal', '[data-apos-cancel]');
      client.waitForNoModals();
    }
  },
  {
    'Open the Workflow Manage modal': (client) => {
      const manageWorkflowTitle = '.apos-modal .apos-modal-title';
      client.openAdminBarItem('apostrophe-workflow-modified-documents');
      client.waitForModal('apostrophe-workflow-modified-documents-manager-modal');
      client.expect.element(manageWorkflowTitle).text.to.contain('Manage Workflow');
    }
  },
  {
    'Apply both the modified and type filters': (client) => {
      const modifiedFilter = '.apos-modal-filter [name=modified]';
      const typeFilter = '.apos-modal-filter [name=type]';
      const optionModifiedFilter = `${modifiedFilter} option[value="1"]`;
      const optionTypeFilter = `${typeFilter} option[value="apostrophe-blog"]`;
      const manageTableRowSelector = 'table[data-items] tr[data-piece]:first-child';
      const articleTitle = `${manageTableRowSelector} td:nth-child(2) a`;
      client.clickWhenReady(optionModifiedFilter);
      client.clickWhenReady(optionTypeFilter);
      client.pause(500);
      client.expect.element(articleTitle).text.to.contain('Apostrophe Workflow Modified Document Article Title');
    }
  },
);
