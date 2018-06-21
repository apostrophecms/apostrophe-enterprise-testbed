let counter = 0;

module.exports = () => {
  counter++;

 return {
    [`[${counter}] blog manager already open. reopen the article. Submit the article.`]: (client) => {
      const modalEditArticleSelector = '.apos-pieces-editor';
      const manageTableRowSelector = '.apos-manage-table tr[data-piece]';
      const editArticleBtnSelector = `${manageTableRowSelector} a`;
      const workflowModalBtnSelector =
        `[data-apos-dropdown-name="workflow"]`;
      const submitWorkflowBtnSelector = `[data-apos-workflow-submit]`;

      client.clickInModal('apostrophe-blog-manager-modal', editArticleBtnSelector);
      client.clickInModal('apostrophe-blog-editor-modal', workflowModalBtnSelector);
      client.clickInModal('apostrophe-blog-editor-modal', submitWorkflowBtnSelector);
    }
  };
};
