import { Router } from "express";
import {
  createOffer,
  deleteOffer,
  execOffer,
  getOffererOffers,
  getOwnerOffers,
} from "../controllers/offers";

const offerRouter = Router();

offerRouter
  .get("/:id/offerer", getOffererOffers)
  .get("/:id/owner", getOwnerOffers)
  .post("/create", createOffer)
  .post("/:id/execute", execOffer)
  .delete("/:id/delete", deleteOffer)

export default offerRouter
