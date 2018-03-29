module.exports = {
  src_folders: ["tests/scenarios"],
  output_folder: "tests/reports",
  globals_path: "tests/setup.js",

  selenium: {
    start_process: false
  },

  test_workers: {
    enabled: false
  },

  test_settings: {
    local: {
      launch_url: 'http://localhost:8081',
      selenium_port: 4444,
      selenium_host: 'localhost',
      silent: true,
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
      selenium_port: 80,
      selenium_host: 'ondemand.saucelabs.com',
      username: process.env.SAUCE_USERNAME,
      access_key: process.env.SAUCE_ACCESS_KEY,
      silent: true,
      screenshots: {
        enabled: true,
        path: './screenshots',
      },
      desiredCapabilities: {
        browserName: 'chrome',
        javascriptEnabled: true,
        acceptSslCerts: true
      }
    }
  }
};
