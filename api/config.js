// Config

const config = {
  NAME_REGEX: /([A-Za-zÀ-ÖØ-öø-ÿ]{4,})$/,
  EMAIL_REGEX: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
  PASSWORD_REGEX: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
  CONTENT_LIMIT_MIN: 1,
  ITEMS_LIMIT: 50,
  ALLOWED_TYPES: {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpeg',
    'image/png': 'png',
  },
  LIMIT_SIZE: 5 * 1024 * 1024,
  ROUTE_IMAGES_PROFILES: 'assets/img/profiles',
  ROUTE_IMAGES_MESSAGES: 'assets/img/messages',
};

module.exports = { config };

export default {};
