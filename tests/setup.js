const onDeath = require('death')({
  uncaughtException: true,
  exit: true,
  SIGUSR1: true,
  SIGUSR2: true,
});
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
};

module.exports = {

  before: function(done) {
    console.log('I - SETUP');
    console.log('BEGIN');
    console.log(process.argv);
    if (isLocalRunning.call(this)) {
      chromedriver.start([
        `--port=${WEBDRIVER_PORT}`,
        '--url-base=wd/hub',
      ]);

      return done();
    }

    checkVenvs();
    sauceConnectLauncher(scOpts, (err) => {
      if (err) {
        console.log("ERROR connecting to sauce labs", err);
      }

      console.log("Started Sauce Connect Process");
      done();
    });
  },
  after: function(done) {
    console.log('I - SETUP AFTER');
    console.log(process.argv);
    clean(done);
  },
  // More time to launch Chrome
  asyncHookTimeout: 50000,
  // More time for other condition tests
  waitForConditionTimeout : 50000,
};

function isLocalRunning() {
  return this.test_settings.selenium_host === 'localhost';
}

function clean(cb) {
  console.log('I - SETUP CLEAN');
  chromedriver.stop();
  sauceConnectLauncher.kill(msg => {
    console.log('SAUCE CONNECT KILL', msg)
  });
  process.exit(0);
}

onDeath((signal, err) => {
  console.log('I - SETUP DEATH', signal, err)
  if (err) {
    console.log(err);
  }

  clean(() => process.exit(signal));
});
