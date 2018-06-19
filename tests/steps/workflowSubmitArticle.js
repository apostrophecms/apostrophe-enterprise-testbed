let counter = 0;

module.exports = () => {
  counter++;

 return {
    [`[${counter}] submit the article via the "Workflow" menu in the dialog box`]: (client) => {
      const modalBlogSelector = '.apostrophe-blog-manager';
      const modalEditArticleSelector = '.apos-pieces-editor';
      const manageTableRowSelector = '.apos-manage-table tr[data-piece]';
      const editArticleBtnSelector = `${manageTableRowSelector} a`;
      const controlSelector = `${modalEditArticleSelector} .apos-modal-controls .apos-dropdown`;
      const workflowModalBtnSelector =
        `${modalEditArticleSelector} [data-apos-dropdown-name="workflow"]`;
      const submitWorkflowBtnSelector = `${modalEditArticleSelector} [data-apos-workflow-submit]`;

      client.waitForElementReady(modalBlogSelector);
      client.waitForElementReady(manageTableRowSelector);
      client.clickWhenReady(editArticleBtnSelector);
      client.waitForElementReady(modalEditArticleSelector);
      client.waitForElementReady(controlSelector);
      client.pause(1000);
      client.clickWhenReady(workflowModalBtnSelector);
      client.useCss();
      client.waitForElementReady(submitWorkflowBtnSelector);
      client.clickWhenReady(submitWorkflowBtnSelector);
      client.waitForElementNotPresent(modalEditArticleSelector);
    }
  };
};
