var moment = require('moment');

module.exports = {
  
  contextual: true,
  
  addFields: [
    {
      name: '_author',
      label: 'Author',
      type: 'joinByOne',
      withType: 'apostrophe-user',
      idField: 'userId',
    }
  ],

  construct: function(self, options) {
    self.generate = function(i) {
      var piece = self.newInstance();
      piece.title = 'Article #' + (i + 1);
      piece.published = true;
      return piece;
    };
  }
  
};
