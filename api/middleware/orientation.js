const modifyExif = require('modify-exif');
const fs = require('fs');
const Jimp = require('jimp');
const { config } = require('../config');

const readFileAsync = async (file) => {
  return await new Promise((resolve, reject) => {
    fs.readFile(file, async (err, data) => {
      err ? reject(err) : resolve(data);
    });
  });
};

exports.correctOrientation = async (image) => {
  let imageOrientation = false;
  let rotateDeg = 0;

  if (
    config.ALLOWED_TYPES[image.mimetype] === 'jpg' ||
    config.ALLOWED_TYPES[image.mimetype] === 'jpeg'
  ) {
    const buffer = modifyExif(await readFileAsync(`${image.path}`), (data) => {
      imageOrientation =
        data && data['0th'] && data['0th']['274'] ? data['0th']['274'] : false;
      if (imageOrientation) {
        if (imageOrientation === 1) {
          imageOrientation = false;
        } else {
          data['0th']['274'] = 1; // reset EXIF orientation value
        }
      }
    });

    if (imageOrientation) {
      switch (imageOrientation) {
        case 3:
          rotateDeg = 180;
          break;
        case 6:
          rotateDeg = 270;
          break;
        case 8:
          rotateDeg = 90;
          reak;
        default:
          rotateDeg = 0;
          break;
      }
      Jimp.read(buffer, (err, lenna) => {
        if (err) {
          console.log('err', err);
          return;
        }
        lenna
          .rotate(rotateDeg) // correct orientation
          .writeAsync(`${image.path}`); // save
      });
    }
  }
};

export default {};
