const passport = require("passport");
const facebookStrategy = require("passport-facebook").Strategy;
const localStrategy = require("passport-local").Strategy;
const UserModel = require("../models/UserModel");
const User = new UserModel();

passport.serializeUser(function (user, done) {
  done(null, {id: user._id, nome: user.name, acesso: user.acesso});
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

passport.use(
  new facebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK,
      profileFields: ["id", "email", "name"],
    },
    function (accessToken, refreshToken, profile, cb) {
      User.FindOrCreateUser({
        name: `${profile._json.first_name} ${profile._json.last_name}`,
        facebookId: profile._json.id,
        email: profile._json.email,
      })
        .then((res) => {
          if (res.user) return cb(null, res.user);
          throw new Error(res.error);
        })
        .catch((err) => {
          return cb(err, null);
        });
    }
  )
);

passport.use(
  new localStrategy(function (username, password, cb) {
    let user = {
      email: username,
      password,
    };
    User.validateLogin(user)
      .then((res) => {
        if (res.user) return cb(null, res.user);
        throw new Error(res.error);
      })
      .catch((err) => {
        return cb(err, null);
      });
  })
);

module.exports = passport;