import { Request, Response, Router } from "express";
import { getUserList, getUser } from "../controllers/users";
var router = Router();

/* GET users listing. */
router
  .get("/", getUserList)
  .get("/:id", getUser)

export default router;
