const shell = require('shelljs');
const once = require('once');
const kp = require('kill-port');

let instances = 0;

exports.create = (address, port, ver) => {
  var server;

  console.log('SERVER', address, port);
  return {
    start(cb) {
      let exe;
      instances++;
      if (instances > 1) {
        console.error('MULTIPLE SERVER INSTANCES. FIX THAT.');
        process.exit(1);
      }
      restoreMongoDump();

      if (ver) {
        exe = ver;
      } else {
        exe = 'app';
      }



      server = shell.exec(`ADDRESS=${address} PORT=${port} node ${exe}`, {async: true,});
      onceCb = once(cb);
      server.stdout.on('data', function() {
        // Not sure why but without this intermediate
        // anonymous function, we never fire. -Tom
        onceCb();
      });
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
    },
    // Run command line task. Not intended to sanitize sneaky input.
    // Synchronous.
    task(args) {
      if (Array.isArray(args)) {
        args = args.join(' ');
      }
      let exe;

      if (ver) {
        exe = ver;
      } else {
        exe = 'app';
      }
      console.log('running task: ', args);
      shell.exec(`node ${exe} ${args}`, {async: false});
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
