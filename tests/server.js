const shell = require('shelljs');
const once = require('once');
const kp = require('kill-port');

let instances = 0;

exports.create = (address, port) => {
  var server;

  console.log('SERVER', address, port);
  return {
    start(cb) {
      instances++;
      if (instances > 1) {
        console.error('MULTIPLE SERVER INSTANCES. FIX THAT.');
        process.exit(1);
      }
      restoreMongoDump();

      server = shell.exec(`ADDRESS=${address} PORT=${port} node app`, {async: true,});
      onceCb = once(cb);

      server.stdout.on('data', onceCb);
    },
    stop(cb) {
      server.kill();
      // We found it very difficult to kill the child process, not just the shell,
      // created by shell.exec by any other means in a mac *and* Linux env. -Tom and Paul
      kp(port).then(function() {
        instances--;
        return cb();
      }).catch(function(e) {
        console.error(e);
        process.exit(1);
      });
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
