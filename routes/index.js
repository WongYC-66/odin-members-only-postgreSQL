var express = require('express');
var router = express.Router();

const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

const users = require('../controllers/users.js')
const messages = require('../controllers/messages.js')

const Message = require('../model/message')

/* GET home page. */
router.get('/', async function (req, res, next) {
  let allMessages = await Message.find()
    .populate('user', 'username')
    .sort({ timestamp: -1})
    .exec()
  res.render('index', { user: req.user, messages: allMessages });
});

// Sign Up Get Request
router.get('/sign-in', users.sign_in_get);

// Sign Up Get Request
router.post('/sign-in', users.sign_in_post);

// Handles User Sign Up Get Request
router.get('/sign-up', users.sign_up_get);

// Handles User Sign Up Post Request, proceed to register into database
router.post('/sign-up', users.sign_up_post);

// Handles User Sign Out Get Request
router.get('/sign-out', users.sign_out_get);

// Handles User Join Club Get Request
router.get('/join-the-club', users.join_club_get);

// Handles User Join Club Post Request
router.post('/join-the-club', users.join_club_post);

// Handles Upgrade to Admin Get Request
router.get('/upgrade-to-admin', users.join_club_admin_get);

// Handles Upgrade to Admin Post Request
router.post('/upgrade-to-admin', users.join_club_admin_post);

// Handles Post new message Post Request
router.post('/message-post', messages.message_post);

// Handles delete message Post Request
router.post('/message-delete-post', messages.message_delete_post);

module.exports = router;
