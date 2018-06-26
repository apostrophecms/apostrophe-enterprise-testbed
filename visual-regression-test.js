const fs = require('fs');
const async = require('async');
const PNG = require('pngjs').PNG;
const uploadfs = require('uploadfs')();
const folder = __dirname + '/screenshots';
const screenshots = fs.readdirSync(folder + '/latest');
const match = require('pixelmatch');
const comparable = {};
const errors = {};

if (!fs.existsSync(folder)) {
  fs.mkdirSync(folder);
}

const archive = (new Date()).toString();

return async.series([
  initUploadfs,
  compare,
  uploadPrevious,
  uploadArchival,
  uploadLatest,
  uploadReport
], function(err) {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  process.exit(0);
});

function initUploadfs(callback) {
  return uploadfs.init({
    backend: process.env.VISUAL_BACKEND || 'local',
    uploadsPath: process.env.VISUAL_UPLOADS_PATH || (__dirname + '/test-uploadfs'),
    uploadsUrl: process.env.VISUAL_UPLOADS_URL || 'file://' + __dirname + '/test-uploadfs',
    secret: process.env.VISUAL_SECRET,
    key: process.env.VISUAL_KEY,
    bucket: process.env.VISUAL_BUCKET,
    region: process.env.VISUAL_REGION
  }, callback);
}

function compare(callback) {
  if (!fs.existsSync(folder + '/previous')) {
    fs.mkdirSync(folder + '/previous');
  }
  if (!fs.existsSync(folder + '/diffs')) {
    fs.mkdirSync(folder + '/diffs');
  }
  return async.series([
    copyOut,
    compare
  ], callback);
  function copyOut(callback) {
    return async.eachSeries(screenshots, function(screenshot, callback) {
      const name = screenshot;
      // What was latest is now previous
      return uploadfs.copyOut('/latest/' + name, folder + '/previous/' + name, function(err) {
        if (!err) {
          comparable[screenshot] = true;
        }
        return callback(null);
      });
    }, callback);
  }
  function compare(callback) {
    return async.eachSeries(screenshots, function(screenshot, callback) {
      if (!comparable[screenshot]) {
        return setImmediate(callback);
      }
      const name = screenshot;
      const img1 = fs.createReadStream(folder + '/previous/' + name).pipe(new PNG()).on('parsed', doneReading);
      const img2 = fs.createReadStream(folder + '/latest/' + screenshot).pipe(new PNG()).on('parsed', doneReading);
      function doneReading() {
        if (!img1.data || !img2.data) {
          // Wait for both
          return;
        }
        const diff = new PNG({ width: img1.width, height: img1.height });
    
        const diffs = match(img1.data, img2.data, diff.data, diff.width, diff.height, {});
    
        return diff.pack().pipe(fs.createWriteStream(folder + '/diffs/' + name)).on('close', function() {
          var error = Math.round(100 * 100 * diffs / (diff.width * diff.height));
          errors[screenshot] = error;
          return uploadfs.copyIn(folder + '/diffs/' + name, '/diffs/' + name, callback);
        });
      }
    }, callback);
  }
}

function uploadPrevious(callback) {
  return async.eachSeries(screenshots, function(screenshot, callback) {
    return uploadfs.copyIn(folder + '/previous/' + screenshot, '/previous/' + screenshot, callback);
  }, callback);
}

function uploadLatest(callback) {
  return async.eachSeries(screenshots, function(screenshot, callback) {
    return uploadfs.copyIn(folder + '/latest/' + screenshot, '/latest/' + screenshot, callback);
  }, callback);
}

function uploadArchival(callback) {
  return async.eachSeries(screenshots, function(screenshot, callback) {
    return uploadfs.copyIn(folder + '/latest/' + screenshot, '/archival/' + archive + '/' + screenshot, callback);
  }, callback);
}

function uploadReport(callback) {
  const comparables = screenshots.filter(screenshot => {
    return comparable[screenshot];
  });
  comparables.sort((a, b) => {
    if (errors[a] > errors[b]) {
      return -1;
    } else if (errors[b] > errors[a]) {
      return 1;
    } else {
      return 0;
    }
  });
  fs.writeFileSync(folder + '/index.html', `<!DOCTYPE html>
    <html>
      <head>
        <title>Visual Regression Diff Report</title>
        <style>
          body {
            font-family: Helvetica;
          }
          img {
            width: 100%;
          }
          h1 {
            text-align: center;
            font-weight: normal;
          }
          h4 {
            text-align: center;
            font-weight: normal;
            font-size: 24px;
          }
          h5 {
            text-align: center;
            font-weight: normal;
          }
          .previous,.latest,.diff {
            float: left;
            width: 33.33333%;
          }
        </style>
      </head>
      <body>
        <h1>Visual Regression Diff Report</h1>
        ${
          comparables.map(screenshot =>
            `
              <h4>${screenshot}</h4>
              <div class="previous">
                <h5>Previous</h5>
                <div><img src="previous/${screenshot}" /></div>
              </div>
              <div class="latest">
                <h5>Latest</h5>
                <div><img src="latest/${screenshot}" /></div>
              </div>
              <div class="diff">
                <h5>Diff</h5>
                <div><img src="diffs/${screenshot}" /></div>
              </div>
            `
          ).join('')
        }
      </body>
    </html>  
  `);
  return uploadfs.copyIn(folder + '/index.html', '/index.html', callback);
}