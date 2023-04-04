import { Request, Response, Router } from "express";
import {
  propertieBuy,
  propertieCreate,
  propertieList,
} from "../controllers/properties";
var router = Router();

/* GET users listing. */
router
  .get("/", propertieList)
  .post("/", propertieCreate)
  .post("/:id/buy", propertieBuy);

export default router;
