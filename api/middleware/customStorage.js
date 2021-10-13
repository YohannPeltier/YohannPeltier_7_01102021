const fs = require('fs');
const { config } = require('../config');

function getDestination(req, file, cb) {
  cb(null, config.ROUTE_IMAGES_NULL);
}

function customStorage(opts) {
  this.getDestination = opts.destination || getDestination;
}

customStorage.prototype._handleFile = function _handleFile(req, file, cb) {
  this.getDestination(req, file, function (err, path) {
    if (err) return cb(err);
    console.log(path);
    var outStream = fs.createWriteStream(path);
    file.stream.pipe(outStream);
    outStream.on('error', cb);
    outStream.on('finish', function () {
      cb(null, {
        filename: path,
        path: path,
        size: outStream.bytesWritten,
      });
    });
  });
};

customStorage.prototype._removeFile = function _removeFile(req, file, cb) {
  fs.unlink(file.path, cb);
};

module.exports = function (opts) {
  return new customStorage(opts);
};

export default {};
