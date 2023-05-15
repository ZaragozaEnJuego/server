import { Router } from "express";
import {
  getOffererOffers,
  getOwnerOffers,
  getOffer,
  createOffer,
  execOffer,
  deleteOffer
} from "../controllers/offers";

const offerRouter = Router();

offerRouter
  .get("/:id/offerer", getOffererOffers)
  .get("/:id/owner", getOwnerOffers)
  .get("/:id", getOffer)
  .post("/create", createOffer)
  .post("/:id/execute", execOffer)
  .delete("/:id/delete", deleteOffer)

export default offerRouter
