import config from "../config";
const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
require('../passport.ts')

var router = express.Router();

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req: any, res: any) => {
    const token = jwt.sign(
      { user: req.body.user },
      config.jwt.secret,
      { expiresIn: '1h' }
    );
    // Aquí debes enviar el JWT como respuesta al cliente
    res.json({ token });
  }
);

export default router;