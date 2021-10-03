// Config

const config = {
  NAME_LIMIT_MIN: 3,
  NAME_LIMIT_MAX: 25,
  EMAIL_REGEX:
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  PASSWORD_REGEX: /^(?=.*\d).{4,8}$/,
  TITLE_LIMIT_MIN: 2,
  CONTENT_LIMIT_MIN: 4,
  ITEMS_LIMIT: 50,
};

module.exports = { config };
