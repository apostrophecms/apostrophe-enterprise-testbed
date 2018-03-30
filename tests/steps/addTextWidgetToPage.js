let counter = 0;

module.exports = (text) => {
  counter++;

  return {
    [`[${counter}] add text "${text}" to the page`]: function(client) {
      const contentMainBlockSelector = '.demo-main';
      const richTextSelector = `${contentMainBlockSelector} [data-rich-text]`;
      const addContentBtnSelector = `${contentMainBlockSelector} [data-apos-add-content]`;
      const richTextBtnSelector = `${contentMainBlockSelector} [data-apos-add-item=apostrophe-rich-text]`;

      client.waitForElementVisible(addContentBtnSelector, 5000);
      client.click(addContentBtnSelector);
      client.waitForElementVisible(richTextBtnSelector, 5000);
      client.pause(200);
      client.click(richTextBtnSelector);
      client.pause(2000);
      client.execute(function (content) {
          const ckeditorInstance = _.find(CKEDITOR.instances);

          ckeditorInstance.setData(content);
        },
        [text]
      );

      client.expect.element(richTextSelector).text.to.contain(text);
    }
  };
};
