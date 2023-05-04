import { Response, Request } from "express";
import config from "../../config";

import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
require("../../passport");

const router = express.Router();
const clientUrl = process.env.CLIENT_URL ?? "http://localhost:5173";

// Rutas de autenticación con Google
router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req: Request, res: Response) => {
      const token = jwt.sign(
        { user: req.body.user },
        'cat',
        { expiresIn: '14h' }
      );
      //envio del JWT como respuesta al cliente
      //res.redirect(`${clientUrl}?token=${token}`)
      res.redirect(`${clientUrl}?token=${token}`) ;
    }
  );

// Rutas de autenticación con GitHub
router.get(
  "/github", 
  passport.authenticate("github")
);

router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: '/api/auth/github' }),
  (req: any, res: any) => {
    const token = jwt.sign(
      { mail: req.body.mail },
      'cat',
      { expiresIn: '14h' }
    );

    //envio del JWT como respuesta al cliente
    res.json({ token, isAdmin: false });
  }
);

// Rutas de autenticación con Discord
router.get(
  "/discord", 
  passport.authenticate("discord")
);

router.get(
  "/discord/callback",
  passport.authenticate("discord", { failureRedirect: '/api/auth/discord' }),
  (req: any, res: any) => {
    const token = jwt.sign(
      { mail: req.body.mail },
      'cat',
      { expiresIn: '14h' }
    );

    //envio del JWT como respuesta al cliente
    res.json({ token, isAdmin: false });
  }
);


export default router;
