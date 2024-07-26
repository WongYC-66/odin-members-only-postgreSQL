const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

const User = require('../model/user')
const Message = require('../model/message')

// Handles new message Post Request
exports.message_post = [
  body("title")
    .escape(),
  body("message")
    .escape(),

  asyncHandler(async (req, res, next) => {
    if (!req.isAuthenticated())
      res.redirect("/")
    const message = new Message({
      title: req.body.title,
      message: req.body.message,
      user: req.user,
      timestamp: new Date(),
    })

    await message.save()
    res.redirect('/')
  })
];

// handle admin delete post 
exports.message_delete_post = asyncHandler(async (req, res, next) => {
  if (req.isAuthenticated() && req.user.isAdmin) {
    let postId = req.body.msgId
    await Message.findByIdAndDelete(postId)
    res.redirect("/");
  } else {
    res.redirect("/");
  }
});



