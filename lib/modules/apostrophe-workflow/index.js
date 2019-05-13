module.exports = {
  afterConstruct: function(self) {
    console.log(self.hostnames);
    console.log(self.prefixes);
    console.log(self.locales);
  }
};

