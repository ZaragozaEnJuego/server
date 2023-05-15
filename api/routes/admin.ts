import { Router } from "express"
import { getUserList, updateAccess } from "../controllers/admin"

const adminRouter = Router()

adminRouter.get("/", getUserList)
adminRouter.patch("/:id/access", updateAccess)

export default adminRouter


