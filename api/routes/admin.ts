/*  Sistemas y Tecnologías Web - Fabra Caro, Francisco
*   Proyecto:                    Zaragoza en Juego 
*   Fichero:                     admin.ts
*   Desarrolladores:             Aréjula Aísa, Íñigo                  - 785370              
*                                González Martínez de Apellániz, Ibón - 756878
*                                Ruiz Borao, Juan José                - 756640
*                                Penacho, Ismael                      - 774572
*/

import { Request, Response, Router } from "express";
import {
    getUserList,
    newUsersPerDay,
    transactionPerDay,
    updateAccess,
    userLoginsPerDay,
} from "../controllers/admin";
import { getUser } from "../controllers/users";

const router = Router();

router.get("/", getUserList);
router.get("/:id", getUser);
router.patch("/:id/access", updateAccess);
router.get("/stats/newUsers", newUsersPerDay);
router.get("/stats/logins", userLoginsPerDay);
router.get("/stats/transactionsPerDay", transactionPerDay);
export default router;
