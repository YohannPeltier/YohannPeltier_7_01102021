// Imports
const express = require('express');
const router = express.Router();

const messagesCtrl = require('../controllers/messages');
const likesCtrl = require('../controllers/likes');

// Routes
router.post('/create', messagesCtrl.createMessage);
router.get('/', messagesCtrl.listMessages);

router.post('/:id/like', likesCtrl.likePost);
router.post('/:id/dislike', likesCtrl.dislikePost);

module.exports = router;

export default {};
