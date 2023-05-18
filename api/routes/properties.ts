/*  Sistemas y Tecnologías Web - Fabra Caro, Francisco
*   Proyecto:                    Zaragoza en Juego 
*   Fichero:                     properties.ts
*   Desarrolladores:             Aréjula Aísa, Íñigo                  - 785370              
*                                González Martínez de Apellániz, Ibón - 756878
*                                Ruiz Borao, Juan José                - 756640
*                                Penacho, Ismael                      - 774572
*/

import { Router } from "express";
import {
    getPropertieList,
    getPropertie,
    getPropertieRules,
    propertieBuy,
} from "../controllers/properties";
const router = Router();

/* GET users listing. */
router
    .get("/", getPropertieList)
    .get("/:id", getPropertie)
    .get("/:id/kindrules", getPropertieRules)
    .post("/:id/buy", propertieBuy);

export default router;
