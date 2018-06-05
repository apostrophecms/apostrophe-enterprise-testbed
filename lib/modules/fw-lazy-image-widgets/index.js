module.exports = {
  extend: 'apostrophe-widgets',
  label: 'Image (Lazily loaded)',
  addFields: [
    {
      name: 'image_1x',
      type: 'singleton',
      label: 'Image - 1x',
      widgetType: 'apostrophe-images'
    },
    {
      name: 'image_2x',
      type: 'singleton',
      label: 'Image - 2x',
      widgetType: 'apostrophe-images'
    },
    {
      name: 'title',
      type: 'string',
      label: 'Title (text that appears in the browser tooltip)'
    },
    {
      name: 'alt',
      type: 'string',
      label: 'Alt text for screenreaders'
    }
  ],
  construct: function (self, options) {
    self.addHelpers({
      getSrcObject: function (image1x, image2x, apos) {
        let obj = {
          src: '',
          placeholder_src: '',
          srcset: '',
          placeholder_srcset: ''
        }
        try {
          const img1x = image1x.items[0]._pieces[0].item.attachment
          obj = {
            src: apos.attachments.url(img1x),
            placeholder_src: apos.attachments.url(img1x, { size: 'one-sixth' }),
            srcset: '',
            placeholder_srcset: ''
          }
        } catch (e) {
          console.error('Error caught in fw-lazy-image - 1x getSrcObject helper. Message: ' + e.message)
          console.error('JSON Dump')
          console.error('image1x: ' + JSON.stringify(image1x))
          return {
            src: '',
            placeholder_src: '',
            srcset: '',
            placeholder_srcset: ''
          }
        }
        try {
          if (image2x.items.length > 0) {
            const img2x = image2x.items[0]._pieces[0].item.attachment
            obj.srcset = apos.attachments.url(img2x) + ' 2x'
            obj.placeholder_srcset = apos.attachments.url(img2x, { size: 'one-sixth' }) + ' 2x'
          }
        } catch (e) {
          console.error('Error caught in fw-lazy-image - 2x getSrcObject helper. Message: ' + e.message)
          console.error('JSON Dump')
          console.error('image2x: ' + JSON.stringify(image2x))
          return {
            src: '',
            placeholder_src: '',
            srcset: '',
            placeholder_srcset: ''
          }
        }
        return obj;
      }
    })
  }
}
