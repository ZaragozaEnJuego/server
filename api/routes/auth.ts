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
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req: Request, res: Response) => {
    const token = jwt.sign({ user: req.body.user }, "cat", { expiresIn: "1h" });
    //envio del JWT como respuesta al cliente
    res.json({ token });
  }
);

export default router;
