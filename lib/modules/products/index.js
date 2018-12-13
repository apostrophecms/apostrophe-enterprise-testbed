module.exports = {
  addFields: [
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
    }
  ],
  construct: function(self, options) {
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