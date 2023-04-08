import { Request, Response, Router } from "express";
import { userCreate, getUserList, getUser, findOrCreateUser } from "../controllers/users";
var router = Router();

/* GET users listing. */
router
  .get("/", getUserList)
  .get("/:id", getUser)
  .post("/", userCreate)
  .post("/:id/", findOrCreateUser);

export default router;
