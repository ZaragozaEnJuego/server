import { Router } from "express";
import {
    createOffer,
    deleteOffer,
    execOffer,
    getOffererOffers,
    getOwnerOffers,
} from "../controllers/offers";

const router = Router();

router
    .get("/offerer/:id", getOffererOffers)
    .get("/owner/:id", getOwnerOffers)
    .post("/", createOffer)
    .post("/accept/:id", execOffer)
    .delete("/:id", deleteOffer);

export default router;
