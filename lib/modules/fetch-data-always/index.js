module.exports = {
  construct: function(self, options) {
    self.pageBeforeSend = function(req, callback) {
      if (!(req.data.page && (req.data.page.type === 'home'))) {
        return callback(null);
      }
      req.data.example = 'nifty';
      return callback(null);
    };
  }
};
