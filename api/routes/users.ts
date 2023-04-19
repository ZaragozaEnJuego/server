import { Request, Response, Router } from "express";
import { getUser } from "../controllers/users";
const router = Router();

/* GET users listing. */
router.get("/:id", getUser);

export default router;
