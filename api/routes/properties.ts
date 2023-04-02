import { Request, Response, Router } from "express";
import { propertieCreate, propertieList } from "../controllers/properties";
var router = Router();

/* GET users listing. */
router.get("/", propertieList).post("/", propertieCreate);

export default router;
