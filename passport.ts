import config from "./config";
import { Response } from "express";
import  { findOrCreateUser } from "./api/controllers/users";
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
        const res: Response;
        findOrCreateUser(accessToken, profile.name, profile.mail, false, res);  //TODO:Mirar como devolver el user
        const user = res.user;
        return cb(null, user);
      } catch (err) {
        return cb(err);
      }
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
