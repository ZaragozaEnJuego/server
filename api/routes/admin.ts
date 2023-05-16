import { Request, Response, Router } from "express";
import {
    getUserList,
    newUsersPerDay,
    updateAccess,
} from "../controllers/admin";
import { getUser } from "../controllers/users";

const router = Router();

router.get("/", getUserList);
router.get("/:id", getUser);
router.patch("/:id/access", updateAccess);
router.get("/stats/newUsers", newUsersPerDay);
export default router;
