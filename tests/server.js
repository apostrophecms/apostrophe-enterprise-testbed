const shell = require('shelljs');
const once = require('once');

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
      var data = '';
      server.stdout.on('data', function(moreData) {
        data += moreData;
        console.log('<', data, '>');
        if (data.match(/Listening on/)) {
          // Still not quite ready sometimes. -Tom
          setTimeout(function() {
            return onceCb(null);
          }, 1000);
        }
      });
    },
    stop(cb) {
      server.kill();
      // We found it very difficult to kill the child process, not just the shell,
      // created by shell.exec by any other means in a mac *and* Linux env. -Tom and Paul

      // This command line is borrowed from that built by the kill-port module
      // but tweaked not to throw an error if the port is already available.
      // Portable to Mac and Linux. -Tom
      try {
        if (process.platform.match(/darwin|bsd/)) {
          shell.exec(`lsof -i tcp:${port} | grep LISTEN | awk '{print $2}' | while IFS= read -r -d '' pid; do kill -9 "$pid"; done`);
        } else {
          shell.exec(`lsof -i tcp:${port} | grep LISTEN | awk '{print $2}' | xargs -r kill -9`);
        }
        instances--;
        return cb();
      } catch (e) {
        console.error(e);
        process.exit(1);
      }
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
