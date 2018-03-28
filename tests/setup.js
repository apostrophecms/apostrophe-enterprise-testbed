const chromedriver = require('chromedriver');
const WEBDRIVER_PORT = 4444;

global.testing = true;

module.exports = {
  before: function(done) {
    chromedriver.start([
      `--port=${WEBDRIVER_PORT}`,
      '--url-base=wd/hub',
    ]);

    done();
  },
  after: function(done) {
    chromedriver.stop();

    done();

    // TODO: There is problem. NW cannot handle exceptions becaus of it
    // dirty hack, because apos still live
    process.exit();
  }
}
