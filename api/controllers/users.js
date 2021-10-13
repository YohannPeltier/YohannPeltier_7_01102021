// Imports
const bcrypt = require('bcrypt');
const asyncLib = require('async');
const fs = require('fs');
const { config } = require('../config');
const models = require('../models');
const auth = require('../middleware/auth');
const { correctOrientation } = require('../middleware/orientation');

// SignUp
exports.signup = async (req, res, next) => {
  // Params
  const email = req.body.email;
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const password = req.body.password;
  const file = req.file;
  const bio = req.body.bio;

  if (file) {
    await correctOrientation(file);
  }

  if (
    email == null ||
    firstname == null ||
    lastname == null ||
    password == null
  ) {
    if (file) fs.unlink(file.path, () => {});
    return res.status(400).json({ error: 'missing parameters' });
  }

  if (
    !config.NAME_REGEX.test(firstname) ||
    !config.NAME_REGEX.test(lastname) ||
    !config.EMAIL_REGEX.test(email) ||
    !config.PASSWORD_REGEX.test(password)
  ) {
    if (file) fs.unlink(file.path, () => {});
    return res.status(400).json({ error: 'invalid parameters' });
  }

  asyncLib.waterfall(
    [
      function (done) {
        models.User.findOne({
          attributes: ['email'],
          where: { email: email },
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
        if (!userFound) {
          bcrypt.hash(password, 5, function (err, bcryptedPassword) {
            done(null, userFound, bcryptedPassword);
          });
        } else {
          if (file) fs.unlink(file.path, () => {});
          return res.status(409).json({ error: 'user already exist' });
        }
      },
      function (userFound, bcryptedPassword, done) {
        let picture = '';
        if (file) {
          picture = file.filename;
        }
        const newUser = models.User.create({
          email: email,
          firstname: firstname,
          lastname: lastname,
          password: bcryptedPassword,
          picture: picture,
          bio: bio,
          isAdmin: 0,
        })
          .then(function (newUser) {
            done(newUser);
          })
          .catch(async function (err) {
            if (file) fs.unlink(file.path, () => {});
            return res.status(500).json({ error: 'cannot add user' });
          });
      },
    ],
    async function (newUser) {
      if (newUser) {
        return res.status(201).json({
          userId: newUser.id,
        });
      } else {
        if (file) fs.unlink(file.path, () => {});
        return res.status(500).json({ error: 'cannot add user' });
      }
    }
  );
};

// Login
exports.login = (req, res, next) => {
  // Params
  const email = req.body.email;
  const password = req.body.password;

  if (email == null || password == null) {
    return res.status(400).json({ error: 'missing parameters' });
  }

  asyncLib.waterfall(
    [
      function (done) {
        models.User.findOne({
          where: { email: email },
        })
          .then(function (userFound) {
            done(null, userFound);
          })
          .catch(function (err) {
            return res.status(500).json({ error: 'unable to verify user' });
          });
      },
      function (userFound, done) {
        if (userFound) {
          bcrypt.compare(
            password,
            userFound.password,
            function (errBycrypt, resBycrypt) {
              done(null, userFound, resBycrypt);
            }
          );
        } else {
          return res.status(404).json({ error: 'user not exist in DB' });
        }
      },
      function (userFound, resBycrypt, done) {
        if (resBycrypt) {
          done(userFound);
        } else {
          return res.status(403).json({ error: 'invalid password' });
        }
      },
    ],
    function (userFound) {
      if (userFound) {
        return res.status(201).json({
          userId: userFound.id,
          token: auth.generateTokenForUser(userFound),
        });
      } else {
        return res.status(500).json({ error: 'cannot log on user' });
      }
    }
  );
};

// Get user profile
exports.getUserProfile = (req, res, next) => {
  // Getting auth header
  const headerAuth = req.headers['authorization'];
  let userId = auth.getUserId(headerAuth);
  let attributes = ['id', 'firstname', 'lastname', 'picture', 'bio', 'isAdmin'];
  const paramsUserId = parseInt(req.params.id);

  if (userId < 0) {
    return res.status(400).json({ error: 'wrong token' });
  } else if (userId === paramsUserId || !paramsUserId) {
    attributes.push('email');
  }

  userId = paramsUserId ? paramsUserId : userId;

  models.User.findOne({
    attributes: attributes,
    where: { id: userId },
  })
    .then(function (user) {
      if (user) {
        res.status(201).json(user);
      } else {
        res.status(404).json({ error: 'user not found' });
      }
    })
    .catch(function (error) {
      res.status(500).json({ error: 'cannot fetch user' });
    });
};

// Get user profile
exports.deleteUserProfile = (req, res, next) => {
  // Getting auth header
  const headerAuth = req.headers['authorization'];
  let userId = auth.getUserId(headerAuth);

  const paramsUserId = parseInt(req.params.id);

  if (userId < 0) {
    return res.status(400).json({ error: 'wrong token' });
  }

  userId = paramsUserId ? paramsUserId : userId;

  asyncLib.waterfall(
    [
      function (done) {
        models.User.findOne({
          where: { id: userId },
        })
          .then(function (userFound) {
            done(null, userFound);
          })
          .catch(function (err) {
            return res.status(500).json({ error: 'unable to verify user' });
          });
      },
      function (userFound, done) {
        if (userFound.id == userId || userFound.isAdmin == 1) {
          fs.unlink(userFound.picture, () => {});
          models.Message.findAll({
            where: { userId: userId },
          })
            .then(function (messagesFound) {
              done(null, userFound, messagesFound);
            })
            .catch(function (err) {
              return res
                .status(500)
                .json({ error: 'unable to verify message' });
            });
        } else {
          return res.status(500).json({ error: 'cannot fetch user' });
        }
      },
      function (userFound, messagesFound, done) {
        if (messagesFound) {
          let messages = messagesFound.map(function (message) {
            return message.toJSON();
          });
          for (let index in messages) {
            if (messages[index].attachement) {
              fs.unlink(messages[index].attachement, () => {});
            }
          }
          userFound
            .destroy()
            .then(function () {
              done(userFound);
            })
            .catch(function (error) {
              console.error(error);
              return res.status(500).json({ error: 'cannot delete user' });
            });
        } else {
          return res.status(500).json({ error: 'no message found' });
        }
      },
    ],
    function (userFound) {
      if (userFound) {
        return res.status(200).json(userFound);
      } else {
        return res.status(500).json({ error: 'cannot delete user' });
      }
    }
  );
};

// Update user profile
exports.updateUserProfile = (req, res) => {
  // Getting auth header
  const headerAuth = req.headers['authorization'];
  const userId = auth.getUserId(headerAuth);

  if (userId <= 0) return res.status(400).json({ error: 'wrong token' });

  // Params
  const bio = req.body.bio;
  const email = req.body.email;

  if (email) {
    if (!config.EMAIL_REGEX.test(email)) {
      return res.status(400).json({ error: 'invalid email' });
    }
  }

  asyncLib.waterfall(
    [
      function (done) {
        models.User.findOne({
          attributes: ['id', 'bio'],
          where: { id: userId },
        })
          .then(function (userFound) {
            done(null, userFound);
          })
          .catch(function (err) {
            return res.status(500).json({ error: 'unable to verify user' });
          });
      },
      function (userFound, done) {
        if (userFound) {
          userFound
            .update({
              bio: bio != null ? bio : userFound.bio,
              email: email ? email : userFound.email,
            })
            .then(function () {
              done(userFound);
            })
            .catch(function (err) {
              res.status(500).json({ error: 'cannot update user' });
            });
        } else {
          res.status(404).json({ error: 'user not found' });
        }
      },
    ],
    function (userFound) {
      if (userFound) {
        return res.status(201).json(userFound);
      } else {
        return res.status(500).json({ error: 'cannot update user profile' });
      }
    }
  );
};

export default {};
