import { Response, Request } from "express";
import config from "../../config";

import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
require("../../passport");

const router = express.Router();

// Rutas de autenticación con Google
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/api/auth/google' }),
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
