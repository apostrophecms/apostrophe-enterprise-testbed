module.exports = {
  // groups: [
  //   {
  //     title: 'guest',
  //     // Allows viewing of pages marked "Login Required"
  //     permissions: [ 'guest' ]
  //   },
  //   {
  //     title: 'edit',
  //     permissions: [ 'edit' ]
  //   },
  //   {
  //     title: 'admin',
  //     permissions: [ 'admin' ]
  //   }
  // ],

  addFields: [
    {
      name: 'thumbnail',
      type: 'singleton',
      widgetType: 'apostrophe-images',
      label: 'Picture',
      options: {
        limit: 1,
        aspectRatio: [100,100]
      }
    }
  ]

};
