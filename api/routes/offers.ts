/*  Sistemas y Tecnologías Web - Fabra Caro, Francisco
*   Proyecto:                    Zaragoza en Juego 
*   Fichero:                     offers.ts
*   Desarrolladores:             Aréjula Aísa, Íñigo                  - 785370              
*                                González Martínez de Apellániz, Ibón - 756878
*                                Ruiz Borao, Juan José                - 756640
*                                Penacho, Ismael                      - 774572
*/

import { Router } from "express";
import {
    createOffer,
    deleteOffer,
    execOffer,
    getOffererOffers,
    getOwnerOffers,
} from "../controllers/offers";

const router = Router();

router
    .get("/offerer/:id", getOffererOffers)
    .get("/owner/:id", getOwnerOffers)
    .post("/", createOffer)
    .post("/accept/:id", execOffer)
    .delete("/:id", deleteOffer);

export default router;
