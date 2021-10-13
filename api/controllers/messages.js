// Imports
const asyncLib = require('async');
const fs = require('fs');
const { config } = require('../config.js');
const models = require('../models');
const auth = require('../middleware/auth');
const { correctOrientation } = require('../middleware/orientation');

// Create message
exports.createMessage = async (req, res, next) => {
  const headerAuth = req.headers['authorization'];
  const userId = auth.getUserId(headerAuth);

  let content = req.body.content;
  const file = req.file;

  if (userId < 0) {
    if (file) fs.unlink(file.path, () => {});
    return res.status(400).json({ error: 'wrong token' });
  }

  if (file) {
    await correctOrientation(file);
  }

  if (content == null && file == null) {
    if (file) fs.unlink(file.path, () => {});
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
            if (file) fs.unlink(file.path, () => {});
            return res.status(500).json({ error: 'unable to verify user' });
          });
      },
      function (userFound, done) {
        let image = '';
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
          if (file) fs.unlink(file.path, () => {});
          res.status(404).json({ error: 'user not found' });
        }
      },
    ],
    async function (newMessage) {
      if (newMessage) {
        return res.status(201).json(newMessage);
      } else {
        if (file) fs.unlink(file.path, () => {});
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

  models.Message.findAll({
    order: [order != null ? order.split(':') : ['createdAt', 'DESC']],
    attributes: fields !== '*' && fields != null ? fields.split(',') : null,
    where: where != null ? { [where.split(':')[0]]: where.split(':')[1] } : '',
    limit:
      limit > 0 && limit <= config.ITEMS_LIMIT ? limit : config.ITEMS_LIMIT,
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
        separate: true,
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

exports.deleteMessage = (req, res, next) => {
  const headerAuth = req.headers['authorization'];
  const userId = auth.getUserId(headerAuth);

  if (userId < 0) {
    return res.status(400).json({ error: 'wrong token' });
  }

  const messageId = parseInt(req.params.id);

  asyncLib.waterfall(
    [
      function (done) {
        models.Message.findOne({
          where: { id: messageId },
        })
          .then(function (messageFound) {
            done(null, messageFound);
          })
          .catch(function (err) {
            return res.status(500).json({ error: 'unable to verify message' });
          });
      },
      function (messageFound, done) {
        if (messageFound) {
          if (userId == messageFound.userId) {
            messageFound
              .destroy()
              .then(function () {
                done(messageFound);
              })
              .catch(function (err) {
                return res.status(500).json({ error: 'cannot delete message' });
              });
          }
        } else {
          return res.status(500).json({ error: 'message does not exist' });
        }
      },
    ],
    function (messageFound) {
      if (messageFound) {
        fs.unlink(messageFound.attachement, () => {});
        return res.status(200).json(messageFound);
      } else {
        return res.status(500).json({ error: 'cannot delete message' });
      }
    }
  );
};

export default {};
