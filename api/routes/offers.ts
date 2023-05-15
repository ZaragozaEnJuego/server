import { Router } from "express";
import {
    createOffer,
    getOffererOffers,
    getOwnerOffers,
} from "../controllers/offers";

const router = Router();

router
    .get("/offerer/:id", getOffererOffers)
    .get("/owner/:id", getOwnerOffers)
    .post("/", createOffer);

export default router;
