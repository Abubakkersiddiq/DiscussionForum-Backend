const User = require("./user");
const bcrypt = require("bcryptjs");
const localStrategy = require("passport-local").Strategy;

module.exports = function (passport) {
  passport.use(
    new localStrategy((username, password, done) => {
      User.findOne({ username: username }, (err, user) => {
        if (err) throw err;
        if (!user) return done(null, false);
        bcrypt.compare(password, user.password, (err, result) => {
          if (err) throw err;
          if (result === true) {
            return done(null, user);
          } else {
            return done(null, false);
          }
        });
      });
    })
  );

  //Serializing the user as cookie information
  passport.serializeUser((user, cb) => {
    cb(null, user.id);
  });

  //Deserializing the user information from the cookies 
  passport.deserializeUser((id, cb) => {
    User.findOne({ _id: id }, (err, user) => {
      const usernameInfo = {
        username: user.username,
      };
      cb(err, usernameInfo);
    });
  });
};
