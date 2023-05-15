import { Router } from "express";
import {
  getOffererOffers,
  getOwnerOffers,
} from "../controllers/offers";

const offerRouter = Router();

offerRouter
  .get("/negotiation/:id", getOffererOffers)
  .get("/negotiation/:id", getOwnerOffers)
//.post("/negotiation", createOffer) queda pendiente por el momento

export default offerRouter;
