import config from "./config";
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: "162455912950-gvl6mce1fmkkc80a4g07ppi75maapmjn.apps.googleusercontent.com",
      clientSecret: config.google.clientSecret,
      callbackURL: config.google.callbackURL
    },
    function(accessToken: any, refreshToken: any, profile: any, cb: any) {
      //User.findOrCreate({ googleId: profile.id }, function (err, user) {
      //  return cb(err, user);
      //});
      cb(null,profile)
    }
  )
);

passport.serializeUser((user: any, done: any) => {
  // Aquí debes serializar al usuario para almacenarlo en la sesión de Passport
  done(null, user);
});

passport.deserializeUser((user: any, done: any) => {
  // Aquí debes deserializar al usuario a partir de la sesión de Passport
  //User.findById(id, function(err, user) {
  //  done(err, user);
  //});
  done(null, user);
});
