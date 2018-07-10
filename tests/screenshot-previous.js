// Visually regression-test the most recently published versions in npm,
// creating "previous" snapshots for reference

const fs = require('fs');
const cp = require('child_process');
const rimraf = require('rimraf');
const uploadfs = require('uploadfs')();

process.chdir(__dirname + '/..');
console.log(process.cwd());

const package = JSON.parse(fs.readFileSync('package.json'));
let tested = [];
const versions = {};

console.log('** beginning');
for (let key in package.dependencies) {
  const version = package.dependencies[key];
  if (version.match(/^github:apostrophe/)) {
    var info = JSON.parse(cp.execSync(`npm info ${key} --json`, { encoding: 'utf8' }));
    tested.push(key);
    versions[key] = info.version;
  }
}

initUploadfs();

function initUploadfs(callback) {
  console.log('** initUploadfs');
  return uploadfs.init({
    backend: process.env.VISUAL_BACKEND || 'local',
    uploadsPath: process.env.VISUAL_UPLOADS_PATH || (__dirname + '/test-uploadfs'),
    uploadsUrl: process.env.VISUAL_UPLOADS_URL || 'file://' + __dirname + '/test-uploadfs',
    secret: process.env.VISUAL_SECRET,
    key: process.env.VISUAL_KEY,
    bucket: process.env.VISUAL_BUCKET,
    region: process.env.VISUAL_REGION
  }, function(err) {
    if (err) {
      throw err;
    }
    go();
    // checkCache();
  });
}

// function checkCache() {
// Not completely thought through, where to keep old screenshots?
//   return uploadfs.copyOut('/published.json', __dirname + '/published.json', function(err) {
//     if (err) {
//       go();
//     }
//     if (versioningKey() !== fs.readFileSync(__dirname + '/published.json', 'utf8')) {
//       go();
//     }
//     console.error('Screenshots of previously published version are already up to date');
//     process.exit(0);
//   });
// }

function go() {
  console.log('** copying');
  tested.forEach(function(module) {
    // This should be easier but npm install --global-style does bad permissions things
    // and then even plain npm install starts failing.
    // we could use git tags:
    // git clone https://github.com/apostrophecms/${module}#${versions[module]} 
    // but we might miss one, so use npm view to get a URL
    const cmd = `mv node_modules/${module} node_modules/${module}.master && cd node_modules && wget \`npm view ${module} dist.tarball\` -O - | tar -zxf - && mv package ${module} && cd ${module} && npm install`;
    console.log(cmd);
    cp.execSync(cmd);
  });
  try {
    console.log('** exec-ing');
    console.log(cp.execSync('VISUAL_CATEGORY=previous ./tests/run-all', { encoding: 'utf8' }));
  } catch (e) {
    console.log('** error');
    console.error(e);
    console.log(e.stdout);
    console.error(e.stderr);
    console.log('Tests failed for EXISTING, PUBLISHED version! Cannot create visual reference');
    restorePackages();
    process.exit(1);
  }
  console.log('** restoring and exiting');
  restorePackages();
  process.exit(0);
  // fs.writeFileSync(__dirname + '/published.json', versioningKey());
  // return uploadfs.copyIn(__dirname + '/published.json', '/published.json', function(err) {
  //   if (err) {
  //     restorePackages();
  //     process.exit(1);
  //   }
  //   restorePackages();
  //   console.log('\n\n\n**** FINISHED PREVIOUS SNAPSHOTS\n\n\n');
  //   process.exit(0);
  // });
}

function restorePackages() {
  tested.forEach(function(module) {
    cp.execSync(`rm -rf node_modules/${module}`);
    cp.execSync(`mv node_modules/${module}.master node_modules/${module}`);
  });
}

// function versioningKey() {
//   var key = {};
//   _.each(tested, function(package) {
//     key[package] = versions[package];
//   });
//   return JSON.stringify(key);
// }
