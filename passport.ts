import config from "./config";
import { findOrCreateUser } from "./api/controllers/users";
import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";

passport.use(
  new GoogleStrategy.Strategy(
    {
      clientID:
        "162455912950-gvl6mce1fmkkc80a4g07ppi75maapmjn.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:3000/api/auth/google/callback",
    },
    function (
      accessToken: string,
      refreshToken: string,
      profile: GoogleStrategy.Profile,
      cb: any
    ) {
      try {
        //checking values
        const name: string =
          profile._json.name === undefined ? "" : profile._json.name;
        const email: string =
          profile._json.email === undefined ? "" : profile._json.email;
        const user = findOrCreateUser(profile._json.sub, name, email, false);
        return cb(null, user);
      } catch (err) {
        return cb(err);
      }
    }
  )
);

passport.serializeUser((user: any, cb: any) => {
  // Aquí debes serializar al usuario para almacenarlo en la sesión de Passport
  cb(null, user);
});

passport.deserializeUser((user: any, cb: any) => {
  // Aquí debes deserializar al usuario a partir de la sesión de Passport
  //User.findById(id, function(err, user) {
  //  done(err, user);
  //});
  cb(null, user);
});
