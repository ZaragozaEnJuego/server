import { Request, Response, Router } from "express"
import { getOffersList, getOffer, createOffer } from "../controllers/offers"

let router = Router()

router
    .get("/negotiation", getOffersList)
    .get("/negotiation", getOffer)
    .post("/negotiation", createOffer)

export default router