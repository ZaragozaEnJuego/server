import { Request, Response, Router } from "express"
import { getOffererOffers, getOwnerOffers, getOffer, createOffer } from "../controllers/offers"

let router = Router()

router
    .get("/negotiation/:id", getOffererOffers)
    .get("/negotiation/:id", getOwnerOffers)
    .get("/negotiation/:id", getOffer)
    .post("/negotiation", createOffer)

export default router