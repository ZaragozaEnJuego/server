import { Request, Response, Router } from "express";
import {
    propertieCreate,
    getPropertieList,
    getPropertie,
    getPropertieRules,
    propertieBuy,
} from "../controllers/properties";
var router = Router();

/* GET users listing. */
router
    .get("/", getPropertieList)
    .get("/:id", getPropertie)
    .get("/:id/kindrules", getPropertieRules)
    .post("/:id/buy", propertieBuy);

/**Test endpoints, do not use on production */
router.post("/test/create", propertieCreate);

export default router;
