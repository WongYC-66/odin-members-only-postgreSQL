const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const bcrypt = require('bcrypt')

const passport = require('passport')

const db = require('../db/query.js')

// Handles User Sign Up Get Request
exports.sign_in_get = asyncHandler(async (req, res, next) => {
  res.render('sign-in', { title: 'Sign In' });
});

// Sign in with passport session authentication
exports.sign_in_post = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/sign-in"
})

// Handles User Sign Up Get Request
exports.sign_up_get = asyncHandler(async (req, res, next) => {
  res.render('sign-up', { title: 'Sign Up' });
});


// Handles User Sign Up Post Request, proceed to register into database
exports.sign_up_post = [
  // Validate and sanitize fields.
  body("password")
    .custom((value, { req }) => {
      return value === req.body.password2;
    })
    .withMessage('password does not match confirm password')
    .escape(),
  body("username")
    .custom(async (value, { req }) => {
      // if username been used by someone 

      let userExisted = await db.getUserByUsername(value)

      if (userExisted) {
        throw new Error('username already in use');
      }
      return true
    })
    .withMessage('username has been used by other')
    .escape(),


  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    let user = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.username,
      password: req.body.password,
      isMember: false
    }

    // There are errors. Render form again with sanitized values/error messages.
    if (!errors.isEmpty()) {
      res.render('sign-up', {
        title: 'Sign Up',
        userForm : user,
        errors: errors.array()
      });
    } else {
      // no error, then encrypt user password and save to DB
      bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
        // if err, do something
        if (err) return next(err)
        // otherwise, store hashedPassword in DB
        try {
          user.password = hashedPassword
          await db.saveNewUser(user);
          res.redirect("/");
        } catch (err) {
          return next(err);
        }
      })
    }
  })
];

// log out
exports.sign_out_get = asyncHandler(async (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

// 
exports.join_club_get = asyncHandler(async (req, res, next) => {
  // must log-in first
  if (req.isAuthenticated() && !req.user.isMember) {
    res.render('join-club', { title: 'Join Club / Member', user: req.user });
  } else {
    res.redirect("/");
  }
});

exports.join_club_post = [
  // Validate and sanitize fields.
  body("inviteCode")
    .custom(value => {
      return value === "123456";
    })
    .withMessage("Incorrect invite code")
    .escape(),

  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // There are errors. Render form again with sanitized values/error messages.
    if (!errors.isEmpty()) {
      res.render('join-club', {
        title: 'Join Club / Member',
        user: req.user,
        errors: errors.array()
      });
    } else {
      // no error, then update isMember status to DB
      await db.findByUserIdAndUpdate(req.user.user_id, { isMember: true })
      req.user.ismember = true
      res.redirect('/')
    }
  })
];

exports.join_club_admin_get = asyncHandler(async (req, res, next) => {
  // must log-in first
  if (req.isAuthenticated() && !req.user.isAdmin) {
    res.render('join-club-admin', { title: 'Upgrade to Admin', user: req.user });
  } else {
    res.redirect("/");
  }
});

exports.join_club_admin_post = [
  // Validate and sanitize fields.
  body("upgradeCode")
    .custom(value => {
      return value === "admin123456";
    })
    .withMessage("Incorrect Upgrade Code")
    .escape(),

  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // There are errors. Render form again with sanitized values/error messages.
    if (!errors.isEmpty()) {
      res.render('join-club-admin', {
        title: 'Upgrade to Admin',
        user: req.user,
        errors: errors.array()
      });
    } else {
      // no error, then update isAdmin status to DB
      await db.findByUserIdAndUpdate(req.user.user_id, { isAdmin: true })
      req.user.isadmin = true
      res.redirect('/')
    }
  })
];




