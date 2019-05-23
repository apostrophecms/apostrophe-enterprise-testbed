var Promise = require('bluebird');

module.exports = {
  extend: 'apostrophe-pieces-widgets',
  label: 'Products',
  addFields: [
    {
      type: 'select',
      name: 'style',
      choices: [
        { 
          label: 'Compact',
          value: 'compact'
        },
        {
          label: 'Large',
          value: 'large'
        }
      ],
      widgetControls: true
    },
    {
      type: 'checkboxes',
      name: 'colors',
      choices: [
        { 
          label: 'Red',
          value: 'red'
        },
        {
          label: 'Green',
          value: 'green'
        },
        {
          label: 'Blue',
          value: 'blue'
        }
      ],
      widgetControls: true
    },
    {
      type: 'select',
      name: 'styleDynamic',
      choices: 'getStyleDynamicChoices',
      widgetControls: true
    },
    {
      type: 'checkboxes',
      name: 'colorsDynamic',
      choices: 'getColorsDynamicChoices',
      widgetControls: true 
    }
  ],
  construct: function(self, options) {
    self.getColorsDynamicChoices = function(req) {
      return Promise.delay(100).then(function() {
        return [
          { 
            label: 'Purple',
            value: 'purple'
          },
          {
            label: 'Yellow',
            value: 'yellow'
          },
          {
            label: 'Silver',
            value: 'silver'
          }
        ];
      });
    };
    self.getStyleDynamicChoices = function(req) {
      return Promise.delay(100).then(function() {
        return [
          { 
            label: 'Hideous',
            value: 'hideous'
          },
          {
            label: 'Intrepid',
            value: 'intrepid'
          }
        ];
      });
    };
  }
};

