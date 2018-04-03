module.exports = {
  construct: function(self, options) {
    var superRenderArea = self.renderArea;
    self.renderArea = function(area, options) {
      console.log('renderArea');
      var richTextOptions = (options.widgets || {})['apostrophe-rich-text'];
      if (richTextOptions) {
        var toolbar = richTextOptions.toolbar || [];
        if (toolbar.indexOf('Bold') === -1) {
          toolbar.push('Bold');
        }
        if (toolbar.indexOf('Italic') === -1) {
          toolbar.push('Italic');
        }
      }
      return superRenderArea(area, options);
    };
  }
};

