const shell = require('shelljs');
const app = require('../app.js');
const aposCfg = {argv: {_: {}}};

let apos;

exports.URL = 'http://localhost:3000';
exports.create = () => {
  return {
    start(cb) {
      // TODO: do not start new instnce
      restoreMongoDump();

      if (!apos) {
        apos = app(aposCfg, () => {cb()});

        return;
      }

      cb();
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
