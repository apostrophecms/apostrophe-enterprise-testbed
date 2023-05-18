var _ = require('@sailshq/lodash');
var Promise = require('bluebird');

module.exports = {
  addFields: [
    {
      name: 'addresses',
      type: 'array',
      titleField: 'street',
      schema: [
        {
          name: 'street',
          type: 'string'
        },
        {
          name: 'boxes',
          type: 'array',
          schema: [
            {
              name: 'number',
              type: 'integer'
            }
          ]
        }
      ]
    },
    {
      name: 'age',
      type: 'integer',
      min: 18,
      max: 150,
      required: true
    },
    {
      name: 'shoeSize',
      type: 'float',
      required: true
    },
    {
      name: 'ageOrShoeSize',
      type: 'select',
      choices: [
        {
          value: 'age',
          label: 'Age',
          showFields: [ 'age' ]
        },
        {
          value: 'shoeSize',
          label: 'Shoe Size',
          showFields: [ 'shoeSize' ]
        }
      ]
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
      piece.title = 'Product #' + pad(i + 1);
      piece.published = true;
      return piece;
    };

  },

  // Make things a little more deterministic for the tests
  sort: { 'title': 1 }
};

function pad(n) {
  if (n < 10) {
    return '0' + n.toString();
  } else {
    return n;
  }
}
