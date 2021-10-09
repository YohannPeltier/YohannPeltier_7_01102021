// Config

const config = {
  NAME_REGEX: /([A-Za-zÀ-ÖØ-öø-ÿ]{4,})$/,
  EMAIL_REGEX: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
  PASSWORD_REGEX: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
  TITLE_LIMIT_MIN: 2,
  CONTENT_LIMIT_MIN: 4,
  ITEMS_LIMIT: 50,
};

module.exports = { config };

export default {};
