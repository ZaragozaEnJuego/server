import { Response, Request } from "express";
import config from "../../config";

import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
require("../../passport");

const router = express.Router();
const clientUrl = process.env.CLIENT_URL ?? "http://localhost:5173";

router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req: any, res: any) => {
      const token = jwt.sign(
        { user: req.body.user },
        'cat',
        { expiresIn: '14h' }
      );
      //envio del JWT como respuesta al cliente
      res.json({ token });
    }
  );

export default router;
