import { Router } from "express";
import {
  getOffererOffers,
  getOwnerOffers,
  getOffer,
} from "../controllers/offers";

const router = Router();

router
  .get("/negotiation/:id", getOffererOffers)
  .get("/negotiation/:id", getOwnerOffers)
  .get("/negotiation/:id", getOffer);
//.post("/negotiation", createOffer) queda pendiente por el momento

export default router;
