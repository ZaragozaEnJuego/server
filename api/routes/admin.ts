import { Request, Response, Router } from "express"
import { getUserList, updateAccess } from "../controllers/admin"

const router = Router()

router.get("/", getUserList)
router.patch("/:id/access", updateAccess)


