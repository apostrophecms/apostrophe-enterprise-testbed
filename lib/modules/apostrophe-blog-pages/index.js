module.exports =
{
  perPage: 5,
  construct(self, options) {
    self.showPage = (req, callback) => {
      console.log(req.locale, req.res.locale);
      console.log(req.__('this is a test, again'));
      console.log(req.res.__('this is a test, again'));
      return callback(null);
    };
  }
};
