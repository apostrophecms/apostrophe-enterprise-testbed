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
      var attempts = 0;
      attempt();
      function attempt() {
        attempts++;
        if (attempts > 200) {
          throw new Error('waited 10 seconds for previous scenario server process to die, I give up');
        }
        try {
          console.log(require('child_process').execSync('lsof -i tcp:3111', { encoding: 'utf8' }));
          lsofSucceeded = true;
        } catch (e) {
          // Good, lsof did not find a listener (nonzero exit status throws exception)
        }
        if (lsofSucceeded) {
          console.log('lsof found a listener on the server port, waiting...');
          setTimeout(attempt, 50);
          return;
        }
        return cb(null);
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
