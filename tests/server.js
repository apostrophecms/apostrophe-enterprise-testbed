const shell = require('shelljs');
const once = require('once');
const kp = require('kill-port');

exports.create = (address, port) => {
  var server;

  console.log('SERVER', address, port);
  return {
    start(cb) {
      restoreMongoDump();

      server = shell.exec(`ADDRESS=${address} PORT=${port} node app`, {async: true,});
      onceCb = once(cb);

      server.stdout.on('data', onceCb);
    },
    stop(cb) {
      server.kill('SIGKILL');
      var lsofSucceeded = false;
      try {
        console.log(require('child_process').execSync('lsof -i tcp:3111', { encoding: 'utf8' }));
        lsofSucceeded = true;
      } catch (e) {
        // Good, lsof did not find a listener (nonzero exit status throws exception)
      }
      if (lsofSucceeded) {
        throw new Error('lsof found a listener');
      }
    }
  };
};

function restoreMongoDump() {
  const cmd = 'mongorestore --noIndexRestore mongodump/ --drop';
  const execRes = shell.exec(cmd, {silent: true});

  if (execRes.code !== 0) {
    const msg = `Unable to restore dump. Error: ${execRes.stderr}`;

    console.log(msg);

    throw new Error(msg);
  }

  console.log('BD has been restored');
}
