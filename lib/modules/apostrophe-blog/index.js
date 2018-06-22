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
      // Make the sort order more deterministic by guaranteeing
      // the date objects differ
      var now = new Date();
      now.setDate(now.getDate() - i);
      piece.publishedAt = moment(now).format('YYYY-MM-DD');
      return piece;
    };
  }
  
};
