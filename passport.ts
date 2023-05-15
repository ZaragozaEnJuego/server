import config from "./config";
import { findOrCreateUser } from "./api/controllers/users";
import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import GitHubStrategy from "passport-github2";
import DiscordStrategy from "passport-discord";
import { error } from "console";

const serverUrl = process.env.SERVER_URL ?? "http://localhost:3000";
passport.use(
    new GoogleStrategy.Strategy(
        {
            clientID:
                "162455912950-gvl6mce1fmkkc80a4g07ppi75maapmjn.apps.googleusercontent.com",
            clientSecret: "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",
            callbackURL: serverUrl + "/api/auth/google/callback",
        },
        async function (
            accessToken: string,
            refreshToken: string,
            profile: GoogleStrategy.Profile,
            done: GoogleStrategy.VerifyCallback
        ) {
            try {
                //checking values
                const name: string =
                    profile._json.name === undefined ? "" : profile._json.name;
                const email: string =
                    profile._json.email === undefined
                        ? ""
                        : profile._json.email;
                const user = await findOrCreateUser(name, email, false);
                // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
                if (user) {
                  done(null, user);
                } else {
                  done(null, false);
                }
            } catch (err) {
                done(err as Error);
            }
        }
    )
);

passport.use(
  new GitHubStrategy.Strategy(
    {
      //clientID: config.github.clientID,
      //clientSecret: config.github.clientSecret,
      clientID:"04d7dcb242b261509049",
      clientSecret: "8369b5549a0c3a95ddde34d4591eba68d4a8e53d",
      callbackURL: serverUrl + "/api/auth/github/callback",
    },
    async function (
      accessToken: string,
      refreshToken: string,
      profile: GitHubStrategy.Profile,
      done: any
    ) {
      try {
        //checking values
        const name: string =
          profile.username === undefined ? "" : profile.username;
        const email: string =
          profile.username+"@github.com" === undefined ? "" : profile.username+"@github.com";
          const user = await findOrCreateUser(name, email, false);
          // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
          if (user) {
            done(null, user);
          } else {
            done(null, false);
          }
      } catch (err) {
          done(err as Error);
      }
  }
)
);

passport.use(
  new DiscordStrategy.Strategy(
    {
      //clientID: config.discord.clientID,
      //clientSecret: config.discord.clientSecret,
      clientID:"1100754605308121108",
      clientSecret: "eRtaYsZkCBTT4Jp40THkzZZiu14e0731",
      callbackURL: serverUrl + "/api/auth/discord/callback",
      scope: ['identify', 'email'],
    },
    async function (
      accessToken: string,
      refreshToken: string,
      profile: DiscordStrategy.Profile,
      done: any
    ) {
      try {
        //checking values
        const name: string =
          profile.username === undefined ? "" : profile.username;
        const email: string =
          profile.username+"@discord.com" === undefined ? "" : profile.username+"@discord.com";
          const user = await findOrCreateUser(name, email, false);
          // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
          if (user) {
            done(null, user);
          } else {
            done(null, false);
          }
      } catch (err) {
          done(err as Error);
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
