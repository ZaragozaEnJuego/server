import { Request, Response, Router } from "express";
import {
  propertieCreate,
  getPropertieList,
  getPropertie,
  propertieBuy,
} from "../controllers/properties";
var router = Router();

/* GET users listing. */
router

  .get("/", getPropertieList)
  .get("/:id", getPropertie)
  .post("/:id/buy", propertieBuy)
  .post("/", propertieCreate);

/**Test endpoints, do not use on production */
router.post("/test/create", propertieCreate);

export default router;
