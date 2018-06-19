let counter = 0;

module.exports = () => {
  counter++;

 return {
    [`[${counter}] reopen the article. Commit the article.`]: (client) => {
      const modalBlogSelector = '.apostrophe-blog-manager';
      const modalEditArticleSelector = '.apos-pieces-editor';
      const modalCommitSelector = '.apos-workflow-commit-modal';
      const controlSelector = `${modalEditArticleSelector} .apos-modal-controls .apos-dropdown`;
      const manageTableRowSelector = '.apos-manage-table tr[data-piece]';
      const editArticleBtnSelector = `${manageTableRowSelector} a`;
      const workflowModalBtnSelector =
        `${modalEditArticleSelector} [data-apos-dropdown-name="workflow"]`;
      const commitWorkflowBtnSelector = `${modalEditArticleSelector} [data-apos-workflow-commit]`;
      const saveBtnSelector = `.apos-workflow-commit-modal [data-apos-save]`;
      const notificationSelector = '.apos-notification-message';
      const articleSelector = '[data-apos-admin-bar-item="apostrophe-blog"]';
      const exportSkipSelector = '.apos-workflow-export-modal [data-apos-cancel]';
      const titleWrapper = ".demo-blog-header-wrapper h3";
      const aposCommitBtnSelector = `${modalCommitSelector} [data-apos-save]`;

      client.waitForElementReady(articleSelector);
      client.clickWhenReady(articleSelector);
      client.waitForElementReady(modalBlogSelector);
      client.waitForElementReady(manageTableRowSelector);
      client.clickWhenReady(editArticleBtnSelector);
      client.waitForElementReady(modalEditArticleSelector);
      client.waitForElementReady(controlSelector);
      client.clickWhenReady(workflowModalBtnSelector);
      client.waitForElementReady(commitWorkflowBtnSelector);
      client.clickWhenReady(commitWorkflowBtnSelector);
      client.waitForElementReady(aposCommitBtnSelector);
      client.clickWhenReady(aposCommitBtnSelector);
      client.waitForElementReady(exportSkipSelector);
      client.clickWhenReady(exportSkipSelector);
      client.waitForElementNotPresent(exportSkipSelector);
      client.waitForElementReady(editArticleBtnSelector);
      client.clickWhenReady('[data-apos-cancel]');
      client.waitForElementNotPresent(modalBlogSelector);
    }
  };
};
