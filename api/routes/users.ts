import { Request, Response, Router } from "express";
import { getUserList, getUser, updateAccess } from "../controllers/users";
var router = Router();

/* GET users listing. */
router
  .get("/", getUserList)
  .get("/:id", getUser)
  .patch("/:id", updateAccess)


export default router;
