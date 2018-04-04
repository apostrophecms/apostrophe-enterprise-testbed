let counter = 0;

module.exports = ({selector, text} = {}) => {
  if (!selector) {
    throw new Error('"selector" is required parameter');
  }

  counter++;

  return {
    [`[${counter}] add text widget "${text}" to the "${selector}" block`]: function(client) {
      const richTextSelector = `${selector} [data-rich-text]`;
      const addContentBtnSelector = `${selector} [data-apos-add-content]`;
      const richTextBtnSelector = `${selector} [data-apos-add-item=apostrophe-rich-text]`;

      client.waitForElementVisible(addContentBtnSelector);
      client.click(addContentBtnSelector);
      client.getLocationInView(selector);
      client.waitForElementVisible(richTextBtnSelector);
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
