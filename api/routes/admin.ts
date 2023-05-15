import { Request, Response, Router } from "express"
import { getUserList, updateAccess } from "../controllers/admin"
import { getUser } from "../controllers/users"

const adminRouter = Router()

adminRouter.get("/", getUserList)
adminRouter.get("/:id", getUser)
adminRouter.patch("/:id/access", updateAccess)

export default adminRouter


