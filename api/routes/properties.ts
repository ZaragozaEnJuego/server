import { Request, Response, Router } from "express";
import {
  propertieCreate,
  getPropertieList,
  getPropertie,
} from "../controllers/properties";
var router = Router();

/* GET users listing. */
router
  .get("/", getPropertieList)
  .get("/:id", getPropertie)
  .post("/", propertieCreate);

export default router;
