/*  Sistemas y Tecnologías Web - Fabra Caro, Francisco
*   Proyecto:                    Zaragoza en Juego 
*   Fichero:                     auth.ts
*   Desarrolladores:             Aréjula Aísa, Íñigo                  - 785370              
*                                González Martínez de Apellániz, Ibón - 756878
*                                Ruiz Borao, Juan José                - 756640
*                                Penacho, Ismael                      - 774572
*/

import { Response, Request } from "express";
import { getAcces, getId, getIsAdmin } from "../controllers/users";

import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { collectLoginStat } from "../controllers/admin";
require("../../passport");

const router = express.Router();
const clientUrl = process.env.CLIENT_URL ?? "http://localhost:5173";

// Rutas de autenticación con Google
router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    async (req: any, res: any) => {
        try {
            const mail = req.user.mail;
            const token = jwt.sign({ mail: mail }, "cat", { expiresIn: "14h" });
            const userId = await getId(mail);
            const isAdmin = await getIsAdmin(mail);
            //envio del JWT como respuesta al cliente
            //res.redirect(`${clientUrl}?token=${token}`)
            const access = await getAcces(mail);
            if (access === false) {
                res.redirect(`${clientUrl}`);
                return;
            }
            await collectLoginStat(userId as string);
            res.redirect(
                `${clientUrl}?token=${token}&userId=${userId}&isAdmin=${isAdmin}`
            );
        } catch (error) {
            res.redirect(`${clientUrl}`);
        }
    }
);

// Rutas de autenticación con GitHub
router.get("/github", passport.authenticate("github"));

router.get(
    "/github/callback",
    passport.authenticate("github", { failureRedirect: "/api/auth/github" }),
    async (req: any, res: any) => {
        try {
            const mail = req.user.mail;
            const token = jwt.sign({ mail: mail }, "cat", { expiresIn: "14h" });
            const userId = await getId(mail);
            const isAdmin = await getIsAdmin(mail);
            //envio del JWT como respuesta al cliente
            //res.redirect(`${clientUrl}?token=${token}`)
            await collectLoginStat(userId as string);
            res.redirect(
                `${clientUrl}?token=${token}&userId=${userId}&isAdmin=${isAdmin}`
            );
        } catch (error) {
            res.redirect(`${clientUrl}`);
        }
    }
);

// Rutas de autenticación con Discord
router.get("/discord", passport.authenticate("discord"));

router.get(
    "/discord/callback",
    passport.authenticate("discord", { failureRedirect: "/api/auth/discord" }),
    async (req: any, res: any) => {
        try {
            const mail = req.user.mail;
            const token = jwt.sign({ mail: mail }, "cat", { expiresIn: "14h" });
            const userId = await getId(mail);
            const isAdmin = await getIsAdmin(mail);
            //envio del JWT como respuesta al cliente
            //res.redirect(`${clientUrl}?token=${token}`)
            await collectLoginStat(userId as string);
            res.redirect(
                `${clientUrl}?token=${token}&userId=${userId}&isAdmin=${isAdmin}`
            );
        } catch (error) {
            res.redirect(`${clientUrl}`);
        }
    }
);

export default router;
