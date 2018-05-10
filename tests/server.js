const shell = require('shelljs');
const once = require('once');

const serverProcesses = [];

exports.clean = () => {
  serverProcesses.forEach((prc) => {
    if (!prc.killed) {
      prc.kill();
    }
  });
};

exports.create = (address, port) => {
  var server;

  console.log('SERVER', address, port);
  return {
    start(cb) {
      restoreMongoDump();

      server = shell.exec(`ADDRESS=${address} PORT=${port} node app`, {async: true,});
      onceCb = once(cb);

      serverProcesses.push(server);
      server.stdout.on('data', onceCb);
    },
    stop(cb) {
      server.kill();
      cb();
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
