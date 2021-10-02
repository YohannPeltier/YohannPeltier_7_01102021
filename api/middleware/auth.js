// Imports
const jwt = require('jsonwebtoken');

// Constants
const TOKEN_SECRET = process.env.TOKEN_SECRET;
const TOKEN_EXPIRE = process.env.TOKEN_EXPIRE;

// Exported functions
exports.generateTokenForUser = (userData) => {
  return jwt.sign(
    {
      userId: userData.id,
      isAdmin: userData.isAdmin,
    },
    TOKEN_SECRET,
    {
      expiresIn: TOKEN_EXPIRE,
    }
  );
};

exports.parseAuthorization = (authorization) => {
  return authorization != null ? authorization.replace('Bearer ', '') : null;
};

exports.getUserId = (authorization) => {
  let userId = -1;
  const token = module.exports.parseAuthorization(authorization);
  if (token != null) {
    try {
      const jwtToken = jwt.verify(token, TOKEN_SECRET);
      if (jwtToken != null) userId = jwtToken.userId;
    } catch (err) {}
  }
  return userId;
};
