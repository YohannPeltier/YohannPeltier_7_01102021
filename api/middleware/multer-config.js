const multer = require('multer');
const { config } = require('../config');

const storageProfile = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, config.ROUTE_IMAGES_PROFILES); // Image storage folder
  },
  fileFilter: (req, file, callback) => {
    if (!config.ALLOWED_TYPES.includes(file.mimetype)) {
      callback('Incorrect filetype', false);
    }
    callback(null, true);
  },
  limits: { fileSize: config.LIMIT_SIZE },
  filename: (req, file, callback) => {
    const fileName = file.originalname.split('.')[0].split(' ').join('_');
    const fileMimetype = config.ALLOWED_TYPES[file.mimetype];
    callback(null, `${fileName}.${fileMimetype}`);
  },
});
const storageMessage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, config.ROUTE_IMAGES_MESSAGES); // Image storage folder
  },
  fileFilter: (req, file, callback) => {
    if (!config.ALLOWED_TYPES.includes(file.mimetype)) {
      callback('Incorrect filetype', false);
    }
    callback(null, true);
  },
  limits: { fileSize: config.LIMIT_SIZE },
  filename: (req, file, callback) => {
    const fileName = file.originalname.split('.')[0].split(' ').join('_');
    const fileMimetype = config.ALLOWED_TYPES[file.mimetype];
    callback(null, `${fileName}.${fileMimetype}`);
  },
});

exports.multerProfile = multer({ storage: storageProfile });
exports.multerMessage = multer({ storage: storageMessage });

export default {};
