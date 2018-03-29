const onDeath = require('death')({uncaughtException: true});
const chromedriver = require('chromedriver');
const sauceConnectLauncher = require('sauce-connect-launcher');

const WEBDRIVER_PORT = 4444;
const scOpts = {
  username: process.env.SAUCE_USERNAME,
  accessKey: process.env.SAUCE_ACCESS_KEY,
};
const checkVenvs = () => {
  if (!process.env.SAUCE_USERNAME) {
    throw new Error('SAUCE_USERNAME is required venv');
  }
  if (!process.env.SAUCE_ACCESS_KEY) {
    throw new Error('SAUCE_ACCESS_KEY is required venv');
  }
}

global.testing = true;

module.exports = {
  before: function(done) {
    if (isLocalRunning.call(this)) {
      chromedriver.start([
        `--port=${WEBDRIVER_PORT}`,
        '--url-base=wd/hub',
      ]);

      return done();
    }

    checkVenvs();
    sauceConnectLauncher(scOpts, (err, sc) => {
      if (err) {
        throw new Error('Unable to connect to SauceLabs.\n' + err);
      }

      this._sc = sc;

      console.log("Started Sauce Connect Process");
      done();
    });
  },
  after: function(done) {
    if (isLocalRunning.call(this)) {
      chromedriver.stop();

      done();
      process.exit();
      return;
    }

    this._sc.close(() => {
      console.log('Closed Sauce Connect process');
      done();

      // TODO: There is problem. NW cannot handle exceptions becaus of it
      // dirty hack, because apos still live
      process.exit();
    });
  }
}

function isLocalRunning() {
  return this.test_settings.selenium_host === 'localhost';
}

onDeath((signal, err) => {
  if (err) {
    console.log(err);
  }

  chromedriver.stop();
  sauceConnectLauncher.kill(() => {
    process.exit(signal);
  });
});
