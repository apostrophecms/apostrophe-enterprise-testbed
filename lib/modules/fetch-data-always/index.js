module.exports = {
  construct: function(self, options) {
    self.pageBeforeSend = function(req, callback) {
      console.log(req.locale, req.res.locale);
      console.log(req.__('this is a test, again'));
      console.log(req.res.__('this is a test, again'));
      if (!(req.data.page && (req.data.page.type === 'home'))) {
        return callback(null);
      }
      req.data.example = 'nifty';
      return callback(null);
    };
  }
};
