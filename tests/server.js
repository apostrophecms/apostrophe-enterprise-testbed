const shell = require('shelljs');
const once = require('once');
const kp = require('kill-port');

exports.clean = clean;

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
      console.log(require('child_process').execSync('lsof -i tcp:3111', { encoding: 'utf8' }));
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
