// Imports
const asyncLib = require('async');
const fs = require('fs');
const { promisify } = require('util');
const { config } = require('../config.js');
const models = require('../models');
const auth = require('../middleware/auth');
const { correctOrientation } = require('../middleware/orientation');

const unlinkAsync = promisify(fs.unlink);

// Create message
exports.createMessage = async (req, res, next) => {
  const headerAuth = req.headers['authorization'];
  const userId = auth.getUserId(headerAuth);

  if (userId < 0) {
    await unlinkAsync(req.file.path);
    return res.status(400).json({ error: 'wrong token' });
  }

  // Params
  let content = req.body.content;
  const file = req.file;

  if (file) {
    await correctOrientation(file);
  }

  if (content == null && file == null) {
    await unlinkAsync(req.file.path);
    return res.status(400).json({ error: 'missing parameters' });
  }

  content = content
    .replace(/(\r\n|\r|\n){2}/g, '$1')
    .replace(/(\r\n|\r|\n){3,}/g, '$1\n');

  asyncLib.waterfall(
    [
      function (done) {
        models.User.findOne({
          where: { id: userId },
        })
          .then(function (userFound) {
            done(null, userFound);
          })
          .catch(async function (err) {
            await unlinkAsync(req.file.path);
            return res.status(500).json({ error: 'unable to verify user' });
          });
      },
      function (userFound, done) {
        let image = null;
        if (file) {
          image = file.filename;
        }
        if (userFound) {
          models.Message.create({
            content: content,
            attachement: image,
            likes: 0,
            UserId: userFound.id,
          }).then(function (newMessage) {
            done(newMessage);
          });
        } else {
          async () => await unlinkAsync(req.file.path);
          res.status(404).json({ error: 'user not found' });
        }
      },
    ],
    async function (newMessage) {
      if (newMessage) {
        return res.status(201).json(newMessage);
      } else {
        await unlinkAsync(req.file.path);
        return res.status(500).json({ error: 'cannot post message' });
      }
    }
  );
};

// List messages
exports.listMessages = (req, res, next) => {
  const headerAuth = req.headers['authorization'];
  const userId = auth.getUserId(headerAuth);

  if (userId < 0) {
    return res.status(400).json({ error: 'wrong token' });
  }

  const fields = req.query.fields;
  const where = req.query.where;
  const limit = parseInt(req.query.limit);
  const offset = parseInt(req.query.offset);
  const order = req.query.order;

  if (limit > config.ITEMS_LIMIT) {
    limit = config.ITEMS_LIMIT;
  }

  models.Message.findAll({
    order: [order != null ? order.split(':') : ['createdAt', 'DESC']],
    attributes: fields !== '*' && fields != null ? fields.split(',') : null,
    whereReq:
      where != null
        ? '{where' + where.split(':')[0] + ':' + where.split(':')[1] + '}'
        : '',
    limit: !isNaN(limit) ? limit : null,
    offset: !isNaN(offset) ? offset : null,
    include: [
      {
        model: models.User,
        as: 'User',
        attributes: ['firstname', 'lastname', 'picture'],
      },
      {
        model: models.Like,
        as: 'Likes',
        attributes: ['MessageId', 'UserId', 'isLike'],
      },
    ],
  })
    .then(function (messages) {
      if (messages) {
        res.status(200).json(messages);
      } else {
        res.status(404).json({ error: 'no messages found' });
      }
    })
    .catch(function (err) {
      res.status(500).json({ error: 'invalid fields' });
    });
};

export default {};
