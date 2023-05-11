import { Request, Response, Router } from "express";
import { propertyPurchases, getPropertiesByKind, collectPropertyPurchaseInfo } from "../controllers/statsAdmin"

const router = Router()

router.get("/", getPropertiesByKind)
router.get("/purchases", propertyPurchases)
router.post("/", collectPropertyPurchaseInfo)

export default router