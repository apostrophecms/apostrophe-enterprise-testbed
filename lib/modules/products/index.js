module.exports = {
  construct: function(self, options) {
    self.generate = function(i) {
      var piece = self.newInstance();
      piece.title = 'Product #' + (i + 1);
      piece.published = true;
      return piece;
    };
  }
};
