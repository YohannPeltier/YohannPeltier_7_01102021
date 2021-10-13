// Imports
const { config } = require('../config.js');
const models = require('../models');
const asyncLib = require('async');
const auth = require('../middleware/auth');

// Create message
exports.createComment = (req, res, next) => {
  const headerAuth = req.headers['authorization'];
  const userId = auth.getUserId(headerAuth);

  if (userId < 0) return res.status(400).json({ error: 'wrong token' });

  // Params
  const content = req.body.content;
  const messageId = parseInt(req.params.id);

  if (content == null) {
    return res.status(400).json({ error: 'missing parameters' });
  }

  if (content.length < config.CONTENT_LIMIT_MIN) {
    return res.status(400).json({ error: 'invalid parameters' });
  }

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
        models.User.findOne({
          where: { id: userId },
        })
          .then(function (userFound) {
            done(null, messageFound, userFound);
          })
          .catch(function (err) {
            return res.status(500).json({ error: 'unable to verify user' });
          });
      },
      function (messageFound, userFound, done) {
        if (userFound) {
          models.Comment.create({
            content: content,
            UserId: userFound.id,
            messageId: messageId,
          }).then(function (newComment) {
            done(null, newComment, messageFound, userFound);
          });
        } else {
          res.status(404).json({ error: 'user not found' });
        }
      },
      function (newComment, messageFound, userFound, done) {
        messageFound
          .update({
            comments: messageFound.comments + 1,
          })
          .then(function () {
            done(newComment);
          })
          .catch(function (err) {
            return res
              .status(500)
              .json({ error: 'cannot update message like counter' });
          });
      },
    ],
    function (newComment) {
      if (newComment) {
        return res.status(201).json(newComment);
      } else {
        return res.status(500).json({ error: 'cannot post message' });
      }
    }
  );
};

// List messages
exports.listComments = (req, res, next) => {
  // Getting auth header
  const headerAuth = req.headers['authorization'];
  const userId = auth.getUserId(headerAuth);

  if (userId < 0) return res.status(400).json({ error: 'wrong token' });
  const fields = req.query.fields;
  const limit = parseInt(req.query.limit);
  const offset = parseInt(req.query.offset);
  const order = req.query.order;

  // Params
  const messageId = parseInt(req.params.id);

  if (limit > config.ITEMS_LIMIT) {
    limit = config.ITEMS_LIMIT;
  }

  models.Comment.findAll({
    order: [order != null ? order.split(':') : ['createdAt', 'ASC']],
    attributes: fields !== '*' && fields != null ? fields.split(',') : null,
    limit: !isNaN(limit) ? limit : null,
    offset: !isNaN(offset) ? offset : null,
    where: {
      messageId: messageId,
    },
    include: [
      {
        model: models.User,
        as: 'User',
        attributes: ['firstname', 'lastname', 'picture'],
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

exports.deleteComment = (req, res, next) => {
  const headerAuth = req.headers['authorization'];
  const userId = auth.getUserId(headerAuth);

  if (userId < 0) {
    return res.status(400).json({ error: 'wrong token' });
  }

  const messageId = parseInt(req.params.id);
  const commentId = parseInt(req.params.commentId);

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
        models.User.findOne({
          where: { id: userId },
        })
          .then(function (userFound) {
            done(null, messageFound, userFound);
          })
          .catch(function (err) {
            return res.status(500).json({ error: 'unable to verify user' });
          });
      },
      function (messageFound, userFound, done) {
        if (userFound.id == userId) {
          models.Comment.destroy({
            where: { id: commentId },
          }).then(function () {
            done(null, messageFound, userFound, { id: commentId });
          });
        } else {
          res.status(404).json({ error: 'user not found' });
        }
      },
      function (messageFound, userFound, commentIdObj, done) {
        messageFound
          .update({
            comments: messageFound.comments - 1,
          })
          .then(function () {
            done(commentIdObj);
          })
          .catch(function (err) {
            return res
              .status(500)
              .json({ error: 'cannot update message like counter' });
          });
      },
    ],
    function (commentIdObj) {
      if (commentIdObj) {
        return res.status(201).json(commentIdObj);
      } else {
        return res.status(500).json({ error: 'cannot post message' });
      }
    }
  );
};

export default {};
