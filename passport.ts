import config from "./config";
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: "162455912950-gvl6mce1fmkkc80a4g07ppi75maapmjn.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:3000/api/auth/google/callback"
    },
    function(accessToken: any, refreshToken: any, profile: any, cb: any) {
      //Aquí se tiene acceso ala info del perfil despues de logearse correctamente, mirar en nuestra bd, sascar info del perfil...
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
