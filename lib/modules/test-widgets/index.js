module.exports = {
  extend: 'apostrophe-widgets',
  label: 'Test',
  addFields: [
    {
      name: '_linked',
      label: 'Linked Documents',
      type: 'joinByArray',
      withType: [ 'apostrophe-page', 'apostrophe-blog' ]
    }
  ]
};
