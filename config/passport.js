const passport = require("passport");
const User = require("../models/authenticate");
const { getUserById } = require("../controllers/authenticate-controller");
// const localStrategy = require("passport-local").Strategy;
const jwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

module.exports = function async(passport) {
    let opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
    opts.secretOrKey = process.env.JWT_SECRET_KEY;

    passport.use(new jwtStrategy(opts, async(jwt_payload, done) => {
        // extract user by Id
        const userId = await getUserById(jwt_payload._id);
        if(userId) return done(null, userId);
        return done(null, false);
    }))
}