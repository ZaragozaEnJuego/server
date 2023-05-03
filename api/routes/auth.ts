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
        successRedirect: "https://client-hqzg5w9fc-785370-unizares.vercel.app",
        failureRedirect: "https://client-hqzg5w9fc-785370-unizares.vercel.app",
    })
);

router.get(
    "/google/login",
    passport.authenticate(
        "google",
        {
            failureRedirect: "http://localhost:5173/",
        },
        (req: any, res: any) => {
            console.log(req.user);

            const token = jwt.sign({ mail: req.body.mail }, "cat", {
                expiresIn: "14h",
            });

            //envio del JWT como respuesta al cliente
            res.json({ token, isAdmin: false });
        }
    )
);

export default router;
