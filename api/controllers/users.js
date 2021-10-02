// Imports
const bcrypt = require('bcrypt');
const models = require('../models');
const auth = require('../middleware/auth');
const { config } = require('../config/config');

// SignUp
exports.signup = (req, res, next) => {
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
      .json({ error: 'wrong username (must be length 3 - 25)' });
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

  models.User.findOne({
    attributes: ['email'],
    where: { email: email },
  })
    .then((userFound) => {
      if (!userFound) {
        bcrypt
          .hash(password, 10)
          .then((hash) => {
            const user = models.User.create({
              email: email,
              firstname: firstname,
              lastname: lastname,
              password: hash,
              bio: bio,
              isAdmin: 0,
            })
              .then((newUser) => {
                return res.status(201).json({ userId: newUser.id });
              })
              .catch((error) => {
                return res.status(500).json({ error: 'cannot add user' });
              });
          })
          .catch((error) => {
            return res.status(500).json({ error });
          });
      } else {
        return res.status(409).json({ error: 'user already exist' });
      }
    })
    .catch((error) => {
      return res.status(500).json({ error: 'unable to verify user' });
    });
};

// Login
exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  if (email == null || password == null) {
    return res.status(400).json({ error: 'missing parameters' });
  }

  models.User.findOne({
    where: { email: email },
  })
    .then((userFound) => {
      if (userFound) {
        bcrypt.compare(password, userFound.password).then((valid) => {
          if (!valid) {
            return res.status(403).json({ error: 'invalid password' });
          }
          return res.status(200).json({
            userId: userFound.id,
            token: auth.generateTokenForUser(userFound),
          });
        });
      } else {
        return res.status(404).json({ error: 'user not exist in DB' });
      }
    })
    .catch((error) => {
      return res.status(500).json({ error: 'unable to verify user' });
    });
};

// Get user profile
exports.getUserProfile = (req, res, next) => {
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
  const headerAuth = req.headers['authorization'];
  const userId = auth.getUserId(headerAuth);

  const bio = req.body.bio;

  models.User.findOne({
    attributes: ['id', 'bio'],
    where: { id: userId },
  }).then((userFound) => {
    if (userFound) {
      userFound
        .update({
          bio: bio ? bio : userFound.bio,
        })
        .then((userFound) => {
          if (userFound) {
            return res.status(201).json(userFound);
          } else {
            return res
              .status(500)
              .json({ error: 'cannot update user profile' });
          }
        })
        .catch((error) => {
          res.status(500).json({ error: 'cannot update user' });
        });
    } else {
      return res.status(404).json({ error: 'user not found' });
    }
  });
};
