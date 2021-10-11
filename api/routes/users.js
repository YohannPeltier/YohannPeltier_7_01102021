// Imports
const express = require('express');
const router = express.Router();

const usersCtrl = require('../controllers/users');

const { multerProfile } = require('../middleware/multer-config');

//console.log(multer.profileImage);

// Routes
router.post(
  '/signup',
  multerProfile.single('profilePicture'),
  usersCtrl.signup
);
router.post('/login', usersCtrl.login);
router.get('/me', usersCtrl.getUserProfile);
router.put('/me', usersCtrl.updateUserProfile);
router.get('/:id', usersCtrl.getUserProfile);

module.exports = router;

export default {};
