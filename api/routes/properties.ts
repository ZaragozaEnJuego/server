import { Request, Response, Router } from "express";
import {
    propertieCreate,
    getPropertieList,
    getPropertie,
    getKindRestriction,
} from "../controllers/properties";
var router = Router();

/* GET users listing. */
router
    .get("/", getPropertieList)
    .get("/:id", getPropertie)
    .get("/restrictions/:kind", getKindRestriction)
    .post("/", propertieCreate);

export default router;
