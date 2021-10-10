// Imports
const express = require('express');
const router = express.Router();

const multer = require('../middleware/multer-config');
const usersCtrl = require('../controllers/users');

//console.log(multer.profileImage);

// Routes
router.post('/signup', multer, usersCtrl.signup);
router.post('/login', usersCtrl.login);
router.get('/me', usersCtrl.getUserProfile);
router.put('/me', usersCtrl.updateUserProfile);
router.get('/:id', usersCtrl.getUserProfile);

module.exports = router;

export default {};
