import { Router } from "express"
import { propertyPurchases, getPropertiesByKind } from "../controllers/statsAdmin"

const adminStatsRouter = Router()

adminStatsRouter.get("/:kind", getPropertiesByKind)
adminStatsRouter.get("/purchases", propertyPurchases)

export default adminStatsRouter