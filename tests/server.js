const shell = require('shelljs');
const app = require('../app.js');
const aposCfg = {argv: {_: {}}};

exports.create = () => {
  let apos;

  return {
    start(cb) {
      restoreMongoDump();

      apos = app(aposCfg, () => {cb()});
    },
    stop(cb) {
      cb();
      // TODO: MongoError if we are trying to destroy
      // apos.destroy(() => {cb()});
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
