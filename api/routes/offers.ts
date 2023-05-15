import { Router } from "express";
import {
    createOffer,
    deleteOffer,
    getOffererOffers,
    getOwnerOffers,
} from "../controllers/offers";

const router = Router();

router
    .get("/offerer/:id", getOffererOffers)
    .get("/owner/:id", getOwnerOffers)
    .post("/", createOffer)
    .delete("/:id", deleteOffer);

export default router;
