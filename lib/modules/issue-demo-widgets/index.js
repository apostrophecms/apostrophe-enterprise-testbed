module.exports = {
  extend: 'apostrophe-widgets',
  label: 'Sample Array Schema',
  addFields: [
    {
      name: 'content_array',
      type: 'array',
      label: 'Array of content items',
      schema: [{
        name: 'image',
        label: 'Logo Image',
        type: 'singleton',
        widgetType: 'fw-lazy-image'
      }]

    }
  ],
  construct: function (self, options) {
  }
}

