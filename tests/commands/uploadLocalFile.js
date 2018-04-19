const path = require('path');
const util = require('util');
const events = require('events');
const archiver = require('archiver');

const handleResult = (cb) => (result) => {
  if (result.status !== 0) {
    throw new Error(result.value.message);
  }

  cb(result.value);
}

function uploadLocalFile () {
  events.EventEmitter.call(this);
}

util.inherits(uploadLocalFile, events.EventEmitter);

uploadLocalFile.prototype.command = function uploadLocalFile (inputSelector, filePath) {
  const self = this;
  const Nightwatch = this.client;
  const api = this.api;
  const uploadRemote = (cb) => {
    let buffers = [];
    let zip = archiver('zip');

    zip
      .on('data', (data) => {buffers.push(data)})
      .on('error', (err) => {throw err;})
      .on('finish', () => {
        const file = Buffer.concat(buffers).toString('base64');

        api.session((session) => {
          const opt = {
            path: `/session/${session.sessionId}/file`,
            method: 'POST',
            data: {file},
          };

          Nightwatch.runProtocolAction(opt, handleResult(cb)).send();
        });
      });

    zip.file(filePath, {name: path.basename(filePath)});
    zip.finalize();
  };

  uploadRemote((tempUrl) => {
    api.setValue(inputSelector, tempUrl, () => self.emit('complete'));
  });

  return self;
}

module.exports = uploadLocalFile;
