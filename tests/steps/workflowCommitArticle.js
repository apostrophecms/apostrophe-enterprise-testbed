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

      client.waitForElementVisible(articleSelector);
      client.click(articleSelector);
      client.waitForElementVisible(modalBlogSelector);
      client.waitForElementVisible(manageTableRowSelector);
      client.click(editArticleBtnSelector);
      client.waitForElementVisible(modalEditArticleSelector);
      client.waitForElementVisible(controlSelector);
      client.click(workflowModalBtnSelector);
      client.waitForElementVisible(commitWorkflowBtnSelector);
      client.click(commitWorkflowBtnSelector);
      client.waitForElementVisible(aposCommitBtnSelector);
      client.click(aposCommitBtnSelector);
      client.waitForElementVisible(exportSkipSelector);
      client.click(exportSkipSelector);
      client.waitForElementNotPresent(exportSkipSelector);
      client.waitForElementVisible(editArticleBtnSelector);
      client.click('[data-apos-cancel]');
      client.waitForElementNotPresent(modalBlogSelector);
    }
  };
};
