// Imports
const models = require('../models');
const auth = require('../middleware/auth');
const asyncLib = require('async');

// Constants
const DISLIKED = 0;
const LIKED = 1;

// Routes
exports.likePost = (req, res, next) => {
  // Getting auth header
  const headerAuth = req.headers['authorization'];
  const userId = auth.getUserId(headerAuth);

  if (userId < 0) return res.status(400).json({ error: 'wrong token' });

  // Params
  const messageId = parseInt(req.params.id);

  if (messageId <= 0) {
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
        if (messageFound) {
          models.User.findOne({
            where: { id: userId },
          })
            .then(function (userFound) {
              done(null, messageFound, userFound);
            })
            .catch(function (err) {
              return res.status(500).json({ error: 'unable to verify user' });
            });
        } else {
          return res.status(404).json({ error: 'message does not exist' });
        }
      },
      function (messageFound, userFound, done) {
        if (userFound) {
          models.Like.findOne({
            where: {
              userId: userId,
              messageId: messageId,
            },
          })
            .then(function (userAlreadyLikedFound) {
              done(null, messageFound, userFound, userAlreadyLikedFound);
            })
            .catch(function (err) {
              return res
                .status(500)
                .json({ error: 'unable to verify is user already liked' });
            });
        } else {
          return res.status(404).json({ error: 'user not exist' });
        }
      },
      function (messageFound, userFound, userAlreadyLikedFound, done) {
        if (!userAlreadyLikedFound) {
          messageFound
            .addUser(userFound, { isLike: LIKED })
            .then(function (alreadyLikeFound) {
              done(null, messageFound, userFound);
            })
            .catch(function (err) {
              return res
                .status(500)
                .json({ error: 'unable to set user reaction' });
            });
        } else {
          if (userAlreadyLikedFound.isLike === DISLIKED) {
            userAlreadyLikedFound
              .update({
                isLike: LIKED,
              })
              .then(function () {
                done(null, messageFound, userFound);
              })
              .catch(function (err) {
                return res
                  .status(500)
                  .json({ error: 'cannot update user reaction' });
              });
          } else {
            return res.status(409).json({ error: 'message already liked' });
          }
        }
      },
      function (messageFound, userFound, done) {
        messageFound
          .update({
            likes: messageFound.likes + 1,
          })
          .then(function () {
            done(messageFound);
          })
          .catch(function (err) {
            return res
              .status(500)
              .json({ error: 'cannot update message like counter' });
          });
      },
    ],
    function (messageFound) {
      if (messageFound) {
        return res.status(201).json(messageFound);
      } else {
        return res.status(500).json({ error: 'cannot update message' });
      }
    }
  );
};
exports.dislikePost = (req, res, next) => {
  // Getting auth header
  const headerAuth = req.headers['authorization'];
  const userId = auth.getUserId(headerAuth);

  // Params
  const messageId = parseInt(req.params.id);

  if (messageId <= 0) {
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
        if (messageFound) {
          models.User.findOne({
            where: { id: userId },
          })
            .then(function (userFound) {
              done(null, messageFound, userFound);
            })
            .catch(function (err) {
              return res.status(500).json({ error: 'unable to verify user' });
            });
        } else {
          res.status(404).json({ error: 'message does not exist' });
        }
      },
      function (messageFound, userFound, done) {
        if (userFound) {
          models.Like.findOne({
            where: {
              userId: userId,
              messageId: messageId,
            },
          })
            .then(function (userAlreadyLikedFound) {
              done(null, messageFound, userFound, userAlreadyLikedFound);
            })
            .catch(function (err) {
              return res
                .status(500)
                .json({ error: 'unable to verify is user already liked' });
            });
        } else {
          res.status(404).json({ error: 'user not exist' });
        }
      },
      function (messageFound, userFound, userAlreadyLikedFound, done) {
        if (userAlreadyLikedFound) {
          if (userAlreadyLikedFound.isLike === LIKED) {
            userAlreadyLikedFound
              .update({
                isLike: DISLIKED,
              })
              .then(function () {
                done(null, messageFound, userFound);
              })
              .catch(function (err) {
                res.status(500).json({ error: 'cannot update user reaction' });
              });
          } else {
            return res
              .status(409)
              .json({ error: 'message is already disliked' });
          }
        } else {
          return res.status(409).json({ error: 'message is not liked' });
        }
      },
      function (messageFound, userFound, done) {
        messageFound
          .update({
            likes: messageFound.likes - 1,
          })
          .then(function () {
            done(messageFound);
          })
          .catch(function (err) {
            res
              .status(500)
              .json({ error: 'cannot update message like counter' });
          });
      },
    ],
    function (messageFound) {
      if (messageFound) {
        return res.status(201).json(messageFound);
      } else {
        return res.status(500).json({ error: 'cannot update message' });
      }
    }
  );
};

export default {};
