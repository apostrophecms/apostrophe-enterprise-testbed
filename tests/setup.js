const onDeath = require('death')({
  uncaughtException: true,
  exit: true,
  SIGUSR1: true,
  SIGUSR2: true,
});
const chromedriver = require('chromedriver');
const sauceConnectLauncher = require('sauce-connect-launcher');
const server = require('./server');

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

      console.log("Started Sauce Connect Process");
      done();
    });
  },
  after: function(done) {
    clean(done);
  }
}

function isLocalRunning() {
  return this.test_settings.selenium_host === 'localhost';
}

function clean(cb) {
  chromedriver.stop();
  server.clean();
  sauceConnectLauncher.kill(cb);
}

onDeath((signal, err) => {
  if (err) {
    console.log(err);
  }

  clean(() => process.exit(signal));
});
