const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

const Message = require('../model/message')

const db = require('../db/query.js')

// Handles new message Post Request
exports.message_post = [
  body("title")
    .escape(),
  body("message")
    .escape(),

  asyncHandler(async (req, res, next) => {
    if (!req.isAuthenticated())
      res.redirect("/")
    const message = {
      title: req.body.title,
      message: req.body.message,
      user_id: req.user.user_id,
      timestamp: new Date().toJSON(),
    }
    // console.log({message})

    await db.saveNewMessage(message)
    res.redirect('/')
  })
];

// handle admin delete post 
exports.message_delete_post = asyncHandler(async (req, res, next) => {
  if (req.isAuthenticated() && req.user.isAdmin) {
    let message_id = req.body.msgId
    await db.findByMessageIdAndDelete(message_id)
    res.redirect("/");
  } else {
    res.redirect("/");
  }
});



