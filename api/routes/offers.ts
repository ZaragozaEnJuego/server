import { Router } from "express";
import {
    createOffer,
    getOffererOffers,
    getOwnerOffers,
} from "../controllers/offers";

const router = Router();

router
    .get("/negotiation/offerer/:id", getOffererOffers)
    .get("/negotiation/owner/:id", getOwnerOffers)
    .post("/negotiation", createOffer);

export default router;
