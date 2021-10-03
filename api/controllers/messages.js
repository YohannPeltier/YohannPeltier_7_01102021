// Imports
const models = require('../models');
const auth = require('../middleware/auth');
const { config } = require('../config.js');

// Create message
exports.createMessage = (req, res, next) => {
  const headerAuth = req.headers['authorization'];
  const userId = auth.getUserId(headerAuth);

  if (userId < 0) return res.status(400).json({ error: 'wrong token' });

  const title = req.body.title;
  const content = req.body.content;

  if (title == null || content == null) {
    return res.status(400).json({ error: 'missing parameters' });
  }

  if (
    title.length < config.TITLE_LIMIT_MIN ||
    content.length < config.CONTENT_LIMIT_MIN
  ) {
    return res.status(400).json({ error: 'invalid parameters' });
  }

  models.User.findOne({
    where: { id: userId },
  })
    .then((userFound) => {
      if (userFound) {
        models.Message.create({
          title: title,
          content: content,
          likes: 0,
          UserId: userFound.id,
        }).then((newMessage) => {
          if (newMessage) {
            return res.status(201).json(newMessage);
          } else {
            return res.status(500).json({ error: 'cannot post message' });
          }
        });
      } else {
        res.status(404).json({ error: 'user not found' });
      }
    })
    .catch((error) => {
      return res.status(500).json({ error: 'unable to verify user' });
    });
};

// List messages
exports.listMessages = (req, res, next) => {
  var fields = req.query.fields;
  var limit = parseInt(req.query.limit);
  var offset = parseInt(req.query.offset);
  var order = req.query.order;

  if (limit > config.ITEMS_LIMIT) {
    limit = config.ITEMS_LIMIT;
  }

  models.Message.findAll({
    order: [order != null ? order.split(':') : ['title', 'ASC']],
    attributes: fields !== '*' && fields != null ? fields.split(',') : null,
    limit: !isNaN(limit) ? limit : null,
    offset: !isNaN(offset) ? offset : null,
    include: [
      {
        model: models.User,
        attributes: ['firstname', 'lastname'],
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
      console.log(err);
      res.status(500).json({ error: 'invalid fields' });
    });
};
