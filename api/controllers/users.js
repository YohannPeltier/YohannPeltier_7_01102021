// Imports
const bcrypt = require('bcrypt');
const { config } = require('../config');
const models = require('../models');
const asyncLib = require('async');
const auth = require('../middleware/auth');

// SignUp
exports.signup = (req, res, next) => {
  // Params
  const email = req.body.email;
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const password = req.body.password;
  const bio = req.body.bio;

  if (
    email == null ||
    firstname == null ||
    lastname == null ||
    password == null
  ) {
    return res.status(400).json({ error: 'missing parameters' });
  }

  if (
    (firstname.length || lastname.length) > config.NAME_LIMIT_MAX ||
    (firstname.length || lastname.length) < config.NAME_LIMIT_MIN
  ) {
    return res
      .status(400)
      .json({ error: 'wrong firstname or lastname (must be length 3 - 25)' });
  }
  if (!config.EMAIL_REGEX.test(email)) {
    return res.status(400).json({ error: 'email is not valid' });
  }

  if (!config.PASSWORD_REGEX.test(password)) {
    return res.status(400).json({
      error:
        'password invalid (must length 4 - 8 and include 1 number at least)',
    });
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
          .catch(function (err) {
            return res.status(500).json({ error: 'unable to verify user' });
          });
      },
      function (userFound, done) {
        if (!userFound) {
          bcrypt.hash(password, 5, function (err, bcryptedPassword) {
            done(null, userFound, bcryptedPassword);
          });
        } else {
          return res.status(409).json({ error: 'user already exist' });
        }
      },
      function (userFound, bcryptedPassword, done) {
        const newUser = models.User.create({
          email: email,
          firstname: firstname,
          lastname: lastname,
          password: bcryptedPassword,
          bio: bio,
          isAdmin: 0,
        })
          .then(function (newUser) {
            done(newUser);
          })
          .catch(function (err) {
            return res.status(500).json({ error: 'cannot add user' });
          });
      },
    ],
    function (newUser) {
      if (newUser) {
        return res.status(201).json({
          userId: newUser.id,
        });
      } else {
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
  const userId = auth.getUserId(headerAuth);

  if (userId < 0) return res.status(400).json({ error: 'wrong token' });

  models.User.findOne({
    attributes: ['id', 'email', 'firstname', 'lastname', 'bio'],
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

// Update user profile
exports.updateUserProfile = (req, res) => {
  // Getting auth header
  const headerAuth = req.headers['authorization'];
  const userId = auth.getUserId(headerAuth);

  if (userId < 0) return res.status(400).json({ error: 'wrong token' });

  // Params
  const bio = req.body.bio;

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
              bio: bio ? bio : userFound.bio,
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
