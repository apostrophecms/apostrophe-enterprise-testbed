// Visually regression-test the most recently published versions in npm,
// creating "previous" snapshots for reference

const fs = require('fs');
const cp = require('child_process');

const uploadfs = require('uploadfs')();

const package = JSON.parse(fs.readFileSync(__dirname + '/../package.json'));
let tested = [];
const versions = {};
for (let key in package.dependencies) {
  const version = package.dependencies[key];
  if (version.match(/^github:apostrophe/)) {
    var info = JSON.parse(cp.execSync(`npm info key --json`, { encoding: 'utf8' }));
    tested.push(key + ':' + info.version);
    versions[key] = info.version;
  }
}

return uploadfs.copyOut('/published.json', __dirname + '/published.json', function(err) {
  if (err) {
    go();
  }
  if (JSON.stringify(tested) !== fs.readFileSync(__dirname + '/published.json', 'utf8')) {
    go();
  }
  console.error('Screenshots of previously published version are already up to date');
  process.exit(0);
});

function go() {
  tested.forEach(function(module) {
    fs.renameSync(`node_modules/${module}`, `node_nodules/${module}.master`);
    cp.execSync(`npm install --global-style ${module}@${versions[module]}`);
  });
  try {
    cp.execSync('VISUAL_CATEGORY=previous ./run-all');
  } catch (e) {
    console.error(e);
    console.log('Tests failed for EXISTING, PUBLISHED version! Cannot create visual reference');
    process.exit(1);
  }
  fs.writeFileSync(__dirname + '/published.json', JSON.stringify(tested));
  return uploadfs.copyIn(__dirname + '/published.json', '/published.json', function(err) {
    if (err) {
      process.exit(1);
    }
    tested.forEach(function(module) {
      cp.execSync(`rm -rf node_modules/{$module}`);
      fs.renameSync(`node_modules/${module}.master`, `node_nodules/${module}`);
    });
    process.exit(0);
  });
}
