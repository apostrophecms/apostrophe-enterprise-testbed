const onDeath = require('death')({
  uncaughtException: true,
  exit: true,
  SIGUSR1: true,
  SIGUSR2: true,
});
const chromedriver = require('chromedriver');

const WEBDRIVER_PORT = 4444;

module.exports = {

  before: function(done) {
    console.log('I - SETUP');
    console.log('BEGIN');
    console.log(process.argv);
    chromedriver.start([
      `--port=${WEBDRIVER_PORT}`,
      '--verbose',
      // Required Chrome flag to run under Docker, which already counts as a sandbox
      '--no-sandbox',
      '--url-base=wd/hub',
    ]);
    return done();
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
  process.exit(0);
}

onDeath((signal, err) => {
  console.log('I - SETUP DEATH', signal, err)
  if (err) {
    console.log(err);
  }

  clean(() => process.exit(signal));
});
