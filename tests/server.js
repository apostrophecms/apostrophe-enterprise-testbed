const shell = require('shelljs');
const once = require('once');
const kp = require('kill-port');
const serverProcesses = [];

exports.clean = clean;

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
      clean(port, cb);
    }
  };
};

function clean(port, cb) {
  serverProcesses.forEach(prc => {
    if (!prc.killed) {
      prc.kill();
    }
  });

  console.log(require('child_process').execSync('/bin/sh -c lsof -i tcp:3111'));

  kp(port)
    .then(msg => {
      console.log('kp ok', msg);
      cb(msg);
    })
    .catch(err => {
      console.log('kp err', err);
      cb(err);
    });
}

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
