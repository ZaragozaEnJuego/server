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
