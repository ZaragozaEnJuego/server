import mongoose from "mongoose";
import Offer from "../models/offers";
import { Request, Response } from "express";
import OfferModel from "../models/offers";
import UserModel from "../models/users";
import PropertieModel from "../models/properties";

const getOffererOffers = async (req: Request, res: Response) => {
  await OfferModel.find({ offerer: req.params.offerer })
    .then((offer) =>
      offer == null
        ? res.status(404).json({ message: "Offer not found" })
        : res.status(200).json(offer)
    )
    .catch((err) => res.status(500).json(err));
};


const getOwnerOffers = async (req: Request, res: Response) => {
  await OfferModel.find({ owner: req.params.owner })
    .then((offers) =>
      offers.length === 0
        ? res.status(404).json({ message: "Offers not found" })
        : res.status(200).json(offers)
    )
    .catch((err) => res.status(500).json(err));
};


const getOffer = async (req: Request, res: Response) => {
  await OfferModel.findById(req.params.id)
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
};

const createOffer = async (req: Request, res: Response) => {
  interface IBody {
    property: string;
    offerer: string;
    owner: string;
    amount: number;
  }
  const body: IBody = req.body;

  if (body.property === undefined) {
    res.status(400).json({ msg: "Required property id" });
    return;
  }

  if (body.offerer === undefined) {
    res.status(400).json({ msg: "Required offerer id" });
    return;
  }

  if (body.owner === undefined) {
    res.status(400).json({ msg: "Required owner id" });
    return;
  }

  if (body.amount === undefined) {
    res.status(400).json({ msg: "Required amount of money" });
    return;
  }

  await OfferModel.create({
    property: body.property,
    offerer: body.offerer,
    owner: body.owner,
    amount: body.amount,
  })
    .then((offer) => {
      res.status(201).json(offer);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
};

const execOffer = async (req: Request, res: Response) => {
  const id = req.params.id;
  if (id === undefined || !mongoose.isObjectIdOrHexString(id)) {
    res.status(400).json({ msg: "No id provided" });
    return;
  }

  try {
    const offer = await OfferModel.findById(id);
    if (offer === null) {
      res.status(404).json({ msg: "The offer does not exist" });
      return;
    }

    const offerer = await UserModel.findById(offer.offerer);
    if (offerer === null) {
      res.status(404).json({ msg: "Offerer not found" });
      return;
    }
    const newOffererBalance = offerer.liquidity - offer.amount;
    await UserModel.findByIdAndUpdate(offer.offerer, {
      liquidity: newOffererBalance,
    });

    await PropertieModel.findByIdAndUpdate(
      offer.property,
      { owner: offer.offerer },
      { new: true }
    );

    const owner = await UserModel.findById(offer.owner);
    if (owner === null) {
      res.status(404).json({ msg: "Owner not found" });
      return;
    }
    const newOwnerBalance = owner.liquidity + offer.amount;
    await UserModel.findByIdAndUpdate(offer.owner, {
      liquidity: newOwnerBalance,
    });
    res.status(201).json({ id: id });
    //collectPropertyPurchaseInfo(offer.property)
  } catch (error: any) {
    res.status(500).json({ msg: error.message });
  }
};

const deleteOffer = async (req: Request, res: Response) => {
  const id = req.params.id;
  if (id === undefined || !mongoose.isObjectIdOrHexString(id)) {
    res.status(400).json({ msg: "No id provided" });
    return;
  }

  try {
    await OfferModel.findByIdAndDelete(id);
    res.status(201).json({ id: id });
  } catch (error: any) {
    res.status(500).json({ msg: error.message });
  }
};

export {
  getOffererOffers,
  getOwnerOffers,
  getOffer,
  createOffer,
  execOffer,
  deleteOffer,
};
