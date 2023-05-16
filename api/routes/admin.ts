import { Request, Response, Router } from "express";
import {
    getUserList,
    newUsersPerDay,
    transactionPerDay,
    updateAccess,
} from "../controllers/admin";
import { getUser } from "../controllers/users";

const router = Router();

router.get("/", getUserList);
router.get("/:id", getUser);
router.patch("/:id/access", updateAccess);
router.get("/stats/newUsers", newUsersPerDay);
router.get("/stats/transactionsPerDay", transactionPerDay);
export default router;
