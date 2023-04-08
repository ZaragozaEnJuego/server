import config from "./config";
import { Request } from "express";
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
      try {
        
        //const user = findOrCreateUser(req, res);
        return cb(null, profile);
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
