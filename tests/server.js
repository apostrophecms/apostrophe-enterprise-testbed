const shell = require('shelljs');
const once = require('once');

const serverProcesses = [];

exports.URL = 'http://localhost:3000';

exports.clean = () => {
  serverProcesses.forEach((prc) => {
    if (!prc.killed) {
      prc.kill();
    }
  });
};

exports.create = () => {
  let server;

  return {
    start(cb) {
      restoreMongoDump();

      process.argv = process.argv.slice(0, 2);

      server = shell.exec('node app', {async: true,});
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
