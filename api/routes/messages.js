// Imports
const express = require('express');
const multer = require('multer');
const router = express.Router();

const messagesCtrl = require('../controllers/messages');
const likesCtrl = require('../controllers/likes');
const commentsCtrl = require('../controllers/comments');

const { multerMessage } = require('../middleware/multer-config');

// Routes
router.post(
  '/create',
  multerMessage.single('messageImage'),
  messagesCtrl.createMessage
);
router.get('/', messagesCtrl.listMessages);

router.post('/:id/like', likesCtrl.likePost);
router.post('/:id/dislike', likesCtrl.dislikePost);

router.post('/:id/comments/create', commentsCtrl.createComment);
router.get('/:id/comments', commentsCtrl.listComments);

module.exports = router;

export default {};
