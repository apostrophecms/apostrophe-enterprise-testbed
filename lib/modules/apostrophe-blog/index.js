var moment = require('moment');
var Promise = require('bluebird');
var _ = require('lodash');

module.exports = {
  
  contextual: true,
  
  addFields: [
    {
      name: '_author',
      label: 'Author',
      type: 'joinByOne',
      withType: 'apostrophe-user',
      idField: 'userId'
    },
    {
      name: 'dynamicSelect',
      label: 'Dynamic Select Test',
      type: 'select',
      choices: 'getDynamicSelectChoices'
    },
    {
      name: 'dynamicCheckboxes',
      label: 'Dynamic Checkboxes Test',
      type: 'checkboxes',
      choices: 'getDynamicSelectChoices'
    }
  ],

  beforeConstruct: function(self, options) {
    options.arrangeFields = [ { name: 'basic', label: 'Basics', fields: ['title', 'slug', 'dynamicSelect', 'dynamicCheckboxes' ] } ];
  },

  construct: function(self, options) {
    self.getDynamicSelectChoices = function(req) {
      if (!req.res) {
        // We don't need req for this sample data but make sure it is there
        throw new Error('valid req was not passed to dynamic choices function');
      }
      // Simulate choices coming from an API
      return Promise.delay(100).then(function() {
        var choices = _.map(_.range(1, 11), function(i) {
          return {
            label: 'Item ' + i,
            value: i
          };
        });
        return choices;
      });
    };
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
