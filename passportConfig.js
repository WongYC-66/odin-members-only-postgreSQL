const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require('bcrypt')
// 
const pgPool = require('./db/pool.js');


const customFields = {
    usernameField: 'username',
    passwordField: 'password',
}

const verifyCallback = async (username, password, done) => {
    try {
        const { rows } = await pgPool.query(`SELECT * FROM users WHERE username = '${username}'`)
        const user = rows[0]

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
    done(null, user.user_id);
});
// Function three : serialization
passport.deserializeUser(async (user_id, done) => {
    try {
        const { rows } = await pgPool.query(`SELECT * FROM users WHERE user_id = '${user_id}'`)
        const user = rows[0]
        done(null, user);
    } catch (err) {
        done(err);
    };
});