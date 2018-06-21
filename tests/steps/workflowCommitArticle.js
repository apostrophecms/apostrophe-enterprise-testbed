let counter = 0;

module.exports = () => {
  counter++;

 return {
    [`[${counter}] blog manager already open. reopen the article. Commit the article.`]: (client) => {
      const modalEditArticleSelector = '.apos-pieces-editor';
      const manageTableRowSelector = '.apos-manage-table tr[data-piece]';
      const editArticleBtnSelector = `${manageTableRowSelector} a`;
      const workflowModalBtnSelector =
        `[data-apos-dropdown-name="workflow"]`;
      const commitWorkflowBtnSelector = `[data-apos-workflow-commit]`;
      const exportSkipSelector = '[data-apos-cancel]';
      const aposCommitBtnSelector = `[data-apos-save]`;

      client.clickInModal('apostrophe-blog-manager-modal', editArticleBtnSelector);
      client.clickInModal('apostrophe-blog-editor-modal', workflowModalBtnSelector);
      client.clickInModal('apostrophe-blog-editor-modal', commitWorkflowBtnSelector);
      client.clickInModal('apostrophe-workflow-commit-modal', aposCommitBtnSelector);
      client.clickInModal('apostrophe-workflow-export-modal', exportSkipSelector);
    }
  };
};
