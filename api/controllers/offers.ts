import mongoose from "mongoose"
import Offer from "../models/offers"
import { Request, Response } from "express"

const getOffererOffers = (req: Request, res: Response) => {
    Offer.find({ offerer: req.body.offerer })
    .then((offer) => res.status(200).json(offer))
    .catch((err) => res.status(500).json(err))
}

const getOwnerOffers = (req: Request, res: Response) => {
  Offer.find({ owner: req.body.owner })
  .then((offer) => res.status(200).json(offer))
  .catch((err) => res.status(500).json(err))
}

const getOffer = (req: Request, res: Response) => {
    Offer.findById(req.params.id)
      .then((offer) => {
        if (offer === null) {
          res.status(404).json({
            message: "Offer not found",
          });
        } else {
          res.status(200).json(offer);
        }
      })
      .catch((err) => res.status(500).json(err));
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

//const deleteOffer
// acceptOffer?? / declineOffer?? --> Pueden ser simplemente eliminadas y estos eventos gestionarlos solo en Frontend

export { getOffererOffers, getOwnerOffers, getOffer, createOffer }

