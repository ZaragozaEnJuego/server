import { Response, Request } from "express";
import config from "../../config";

import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
require("../../passport");

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "http://localhost:5173/",
    failureRedirect: "http://localhost:5173/",
  })
);

router.get("/google/login", (req: any, res: any) => {
  console.log(req.user);

  const token = jwt.sign({ mail: req.body.mail }, "cat", {
    expiresIn: "14h",
  });

  //envio del JWT como respuesta al cliente
  res.json({ token, isAdmin: false });
});
export default router;
