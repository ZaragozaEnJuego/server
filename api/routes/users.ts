import { Request, Response, Router } from "express";
import { getUser } from "../controllers/users";
var router = Router();

/* GET users listing. */
router.get("/:id", getUser);

export default router;
