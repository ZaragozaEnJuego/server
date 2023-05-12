import { Router } from "express";
import {
  getOffererOffers,
  getOwnerOffers,
  getOffer,
  createOffer,
  execOffer,
  deleteOffer
} from "../controllers/offers";

const router = Router();

router
  .get("/negotiation/:id/offerer", getOffererOffers)
  .get("/negotiation/:id/owner", getOwnerOffers)
  .get("/negotiation/:id", getOffer)
  .post("/negotiation/create", createOffer)
  .post("/negotiation/:id/execute", execOffer)
  .delete("/negotiation/:id/delete", deleteOffer)

export default router
