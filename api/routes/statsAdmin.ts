import { Router } from "express"
import { propertyPurchases, getPropertiesByKind } from "../controllers/statsAdmin"

const router = Router()

router.get("/kind:", getPropertiesByKind)
router.get("/purchases", propertyPurchases)

export default router