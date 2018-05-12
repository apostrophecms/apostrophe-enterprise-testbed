module.exports = {
  src_folders: ["tests/scenarios"],
  output_folder: "tests/reports",
  globals_path: "tests/setup.js",
  custom_commands_path: "tests/commands",

  selenium: {
    start_process: false,
    cli_args: {
      "webdriver.chrome.driver" : "./node_modules/chromedriver/bin/chromedriver",
    }
  },

  test_settings: {
    local: {
      launch_url: 'http://localhost:8081',
      selenium_port: 4444,
      selenium_host: 'localhost',
      silent: true,
      apos_address: 'localhost',
      apos_port: 3111,
      screenshots: {
        enabled: true,
        path: './screenshots',
      },
      desiredCapabilities: {
        browserName: 'chrome',
        javascriptEnabled: true,
        acceptSslCerts: true,
      }
    },
    remote: {
      launch_url: 'http://ondemand.saucelabs.com:80',
      username: process.env.SAUCE_USERNAME,
      access_key: process.env.SAUCE_ACCESS_KEY,
      apos_address: 'localhost',
      apos_port: 3000,
      globals: {
        waitForConditionTimeout: 5000, // sometimes internet is slow so wait.
      },
      silent: true,
      screenshots: {
        enabled: true,
        path: './screenshots',
      },
      desiredCapabilities: {
        browserName: 'chrome',
        javascriptEnabled: true,
        acceptSslCerts: true,
        extendedDebugging: true,
        "tunnel-identifier": process.env.TRAVIS_JOB_NUMBER,
        build: process.env.TRAVIS_BUILD_NUMBER,
        username: process.env.SAUCE_USERNAME,
        accessKey: process.env.SAUCE_ACCESS_KEY
      },
    },
  }
};
