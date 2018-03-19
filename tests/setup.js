const phantomjs = require('phantomjs-prebuilt');
const WEBDRIVER_PORT = 4444;

global.testing = true;

module.exports = {
  before: function(done) {
    phantomjs.run(`--webdriver=${WEBDRIVER_PORT}`)
      .then(program => {
        this._phantomjs = program;
        done();
      });
  },
  after: function(done) {
    this._phantomjs.kill();
    done();

    // TODO: There is problem. NW cannot handle exceptions becaus of it
    // dirty hack, because apos still live
    process.exit();
  }
}
