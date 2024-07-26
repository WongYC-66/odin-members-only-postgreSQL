const passport = require("passport");
const session = require("express-session");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require('bcrypt')

const User = require("./model/user")

const customFields = {
    usernameField: 'username',
    passwordField: 'password',
}

const verifyCallback = async (username, password, done) => {
    try {
        const user = await User.findOne({ username: username });
        if (!user) {
            console.log("incorrect username")
            return done(null, false, { message: "Incorrect username" });
        };

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            // passwords do not match!
            console.log("incorrect password")

            return done(null, false, { message: "Incorrect password" })
        }
        return done(null, user);
    } catch (err) {
        return done(err);
    };
}

const strategy = new LocalStrategy(customFields, verifyCallback)
passport.use(strategy)


passport.serializeUser((user, done) => {
    done(null, user.id);
});
// Function three : serialization
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    };
});