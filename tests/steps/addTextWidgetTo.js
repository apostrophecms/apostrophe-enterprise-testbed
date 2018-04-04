let counter = 0;

module.exports = ({block, text} = {}) => {
  if (!block) {
    throw new Error('"block" is required parameter');
  }

  counter++;

  return {
    [`[${counter}] add text widget "${text}" to the "${block}" block`]: function(client) {
      const richTextSelector = `${block} [data-rich-text]`;
      const addContentBtnSelector = `${block} [data-apos-add-content]`;
      const richTextBtnSelector = `${block} [data-apos-add-item=apostrophe-rich-text]`;

      client.waitForElementVisible(addContentBtnSelector);
      client.click(addContentBtnSelector);
      client.getLocationInView(block);
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
