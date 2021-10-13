// Imports
const express = require('express');
const router = express.Router();

const usersCtrl = require('../controllers/users');

const { multerProfile } = require('../middleware/storages');

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
router.delete('/:id', usersCtrl.deleteUserProfile);

module.exports = router;

export default {};
