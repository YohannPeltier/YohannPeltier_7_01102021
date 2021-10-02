// Imports
const express = require('express');
const router = express.Router();

const usersCtrl = require('../controllers/users');

// Routes
router.post('/signup', usersCtrl.signup);
router.post('/login', usersCtrl.login);
router.get('/me', usersCtrl.getUserProfile);
router.put('/me', usersCtrl.updateUserProfile);

module.exports = router;
