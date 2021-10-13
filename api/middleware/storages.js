const multer = require('multer');
const crypto = require('crypto');
const customStorage = require('./customStorage');
const { config } = require('../config');

function createFileName(file) {
  const fileName = crypto.randomBytes(10).toString('hex');
  const fileMimetype = config.ALLOWED_TYPES[file.mimetype];
  return `${Date.now()}_${fileName}.${fileMimetype}`;
}

const fileFilerStorage = (req, file, cb) => {
  if (!config.ALLOWED_TYPES.includes(file.mimetype)) {
    cb('Incorrect filetype', false);
  }
  cb(null, true);
};

const storageProfile = customStorage({
  destination: (req, file, cb) => {
    cb(null, `${config.ROUTE_IMAGES_PROFILES}/${createFileName(file)}`); // Image storage folder
  },
  fileFilter: fileFilerStorage,
  limits: { fileSize: config.LIMIT_SIZE },
  filename: (req, file, cb) => {},
});

const storageMessage = customStorage({
  destination: (req, file, cb) => {
    cb(null, `${config.ROUTE_IMAGES_MESSAGES}/${createFileName(file)}`); // Image storage folder
  },
  fileFilter: fileFilerStorage,
  limits: { fileSize: config.LIMIT_SIZE },
});

exports.multerProfile = multer({
  storage: storageProfile,
  limits: { fileSize: config.LIMIT_SIZE },
});

exports.multerMessage = multer({
  storage: storageMessage,
});

export default {};
