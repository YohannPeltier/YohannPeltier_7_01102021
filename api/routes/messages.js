// Imports
const express = require('express');
const router = express.Router();

const messagesCtrl = require('../controllers/messages');

// Routes
router.post('/create', messagesCtrl.createMessage);
router.get('/', messagesCtrl.listMessages);

module.exports = router;

export default {};
