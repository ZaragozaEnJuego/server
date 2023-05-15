import mongoose from "mongoose"
import Offer from "../models/offers"
import { Request, Response } from "express"

const getOffererOffers = (req: Request, res: Response) => {
    Offer.find({ offerer: req.params.offerer })
    .then((offer) => offer == null ? res.status(404).json({ message: "Offer not found" }) : res.status(200).json(offer))
    .catch((err) => res.status(500).json(err))
}

const getOwnerOffers = (req: Request, res: Response) => {
  Offer.find({ owner: req.params.owner })
  .then((offer) => offer == null ? res.status(404).json({ message: "Offer not found" }) : res.status(200).json(offer))
  .catch((err) => res.status(500).json(err))
}

const createOffer = (req: Request, res: Response) => {
    Offer.create({
        property: "Id_property",
        offerer: "ID_landlord_offerer",
        owner: "ID_landlord_owner",
        amount: 100000
    })
    .then((offer) => {
        res.status(201).json(offer);
      })
      .catch((err) => {
        res.status(400).json(err);
      });
}

export { getOffererOffers, getOwnerOffers, createOffer }

