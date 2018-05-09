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
      const titleWrapper = ".demo-blog-header-wrapper h3";

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
      client.waitForElementVisible(titleWrapper);

      client.expect.element(titleWrapper).text.to.equal('New Article Title');

      client.waitForElementVisible(saveBtnSelector);
      client.click(saveBtnSelector);
      client.waitForElementNotPresent(notificationSelector);
        const exportSkipSelector = '.apos-workflow-commit-modal [data-apos-cancel]';
      client.waitForElementVisible(exportSkipSelector)
      client.keys(client.Keys.ESCAPE);
    }
  };
};
