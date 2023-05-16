import mongoose from "mongoose";
import Offer from "../models/offers";
import { Request, Response } from "express";
import PropertieModel from "../models/properties";
import OfferModel from "../models/offers";
import UserModel from "../models/users";

/**
 * @swagger
 * tags:
 *    name: Offers
 *    description: The offers managing API
 * /offers:
 *    get:
 *      summary: List all offers when offerer is user
 *      tags: [Offers]
 *      parameters:
 *        - in: path
 *          name: offerer
 *          schema:
 *             type: string
 *          required: true
 *          description: The property offerer id
 *      responses:
 *        200:
 *          description: The offers list
 *          content:
 *              application/json:
 *                schema:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      _id:
 *                        type: string
 *                        description: The auto-generated offer id
 *                        nullable: true
 *                      property:
 *                        type: string
 *                        description: The id of offered property
 *                      offerer:
 *                        type: string
 *                        description: The id of offerer user
 *                      owner:
 *                        type: string
 *                        description: The id of owner user
 *                      amount:
 *                        type: number
 *                        description: The involved amount of money in the offer
 *        404:
 *           description: Offer not found
 *        500:
 *           description: Some server error
 */
const getOffererOffers = async (req: Request, res: Response) => {
  const id = req.params.id;
  // Verificar si se proporcionó el ID de offerer
  if (id === undefined) {
    res.status(404).json({
      message: "Not found, offerer ID is required",
    });
    return;
  }
  try {
    interface OfferDT {
      _id?: string;
      property: string;
      offerer: string;
      owner: string;
      amount: number;
    }
    const offers: OfferDT[] = await Offer.find({ offerer: id });

    // Obtener los nombres de los propietarios usando Promise.all()
    const ownerPromises = offers.map((offer: OfferDT) => {
      return UserModel.findById(offer.owner).then((owner) => owner?.name ?? "");
    });
    const owners = await Promise.all(ownerPromises);

    // Asignar los nombres de los propietarios a los objetos de oferta correspondientes
    const offersWithName = offers.map((offer: OfferDT, index) => {
      offer.owner = owners[index];
      return offer;
    });

    res.status(200).json(offersWithName);
  } catch (error) {
    res.status(500).json(error);
  }
};

/**
 * @swagger
 * tags:
 *    name: Offers
 *    description: The offers managing API
 * /offers:
 *    get:
 *      summary: List all offers when owner is user
 *      tags: [Offers]
 *      parameters:
 *        - in: path
 *          name: owner
 *          schema:
 *             type: string
 *          required: true
 *          description: The property owner id
 *      responses:
 *        200:
 *          description: The offers list
 *          content:
 *              application/json:
 *                schema:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      _id:
 *                        type: string
 *                        description: The auto-generated offer id
 *                        nullable: true
 *                      property:
 *                        type: string
 *                        description: The id of offered property
 *                      offerer:
 *                        type: string
 *                        description: The id of offerer user
 *                      owner:
 *                        type: string
 *                        description: The id of owner user
 *                      amount:
 *                        type: number
 *                        description: The involved amount of money in the offer
 *        404:
 *           description: Offer not found
 *        500:
 *           description: Some server error
 */
const getOwnerOffers = async (req: Request, res: Response) => {
  const id = req.params.id;
  // Verificar si se proporcionó el ID de offerer
  if (id === undefined) {
    res.status(404).json({
      message: "Not found, offerer ID is required",
    });
    return;
  }
  try {
    interface OfferDT {
      _id?: string;
      property: string;
      offerer: string;
      owner: string;
      amount: number;
    }
    const offers: OfferDT[] = await Offer.find({ owner: id });

    // Obtener los nombres de los propietarios usando Promise.all()
    const offererPromises = offers.map((offer: OfferDT) => {
      return UserModel.findById(offer.offerer).then(
        (offerer) => offerer?.name ?? ""
      );
    });
    const offerers = await Promise.all(offererPromises);

    // Asignar los nombres de los propietarios a los objetos de oferta correspondientes
    const offersWithName = offers.map((offer: OfferDT, index) => {
      offer.offerer = offerers[index];
      return offer;
    });

    res.status(200).json(offersWithName);
  } catch (error) {
    res.status(500).json(error);
  }
};

/**
 * @swagger
 * tags:
 *    name: Offers
 *    description: The offers managing API
 * /offers/{id}::
 *    post:
 *      summary: Create a new offer
 *      tags: [Offers]
 *      parameters:
 *        - in: path
 *          name: property
 *          schema:
 *             type: string
 *          required: true
 *          description: The id of the property which is going to be offered
 *        - in: path
 *          name: amount
 *          schema:
 *             type: number
 *          required: true
 *          description: The amount of money offered in exchange
 *      responses:
 *        201:
 *          description: The new offer is created
 *          content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    _id:
 *                      type: string
 *                      description: The auto-generated offer id
 *                      nullable: true
 *                    property:
 *                      type: string
 *                      description: The id of offered property
 *                    offerer:
 *                      type: string
 *                      description: The id of offerer user
 *                    owner:
 *                      type: string
 *                      description: The id of owner user
 *                    amount:
 *                      type: number
 *                      description: The involved amount of money in the offer
 *        400:
 *           description: Error trying to create an offer
 */
const createOffer = async (req: Request, res: Response) => {
  interface CreateOfferDTO {
    property: string;
    offerer: string;
    amount: number;
  }
  const body: CreateOfferDTO = req.body;
  if (body.property === undefined) {
    res.status(400).json({ msg: "Required property id" });
    return;
  }
  if (body.offerer === undefined) {
    res.status(400).json({ msg: "Required offerer id" });
    return;
  }

  if (body.amount === undefined || body.amount < 0) {
    res.status(400).json({ msg: "Amount must be a positive number" });
    return;
  }
  try {
    const property = await PropertieModel.findById(body.property);
    const offer = await OfferModel.create({
      property: body.property,
      owner: property?.owner,
      offerer: body.offerer,
      amount: body.amount,
    });
    res.status(201).json({ id: offer?._id });
  } catch (error: any) {
    res.status(500).json(error);
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

const execOffer = async (req: Request, res: Response) => {
  const id = req.params.id;
  if (id === undefined || !mongoose.isObjectIdOrHexString(id)) {
    res.status(400).json({ msg: "No id provided" });
    return;
  }

  try {
    const offer = await OfferModel.findById(id);
    if (offer === undefined || offer === null) {
      res.status(404).json({ msg: "The offer does not exist" });
      return;
    }

    const offerer = await UserModel.findById(offer.offerer);
    if (offerer === undefined || offerer === null) {
      res.status(404).json({ msg: "Offerer not found" });
      return;
    }
    const newOffererBalance = offerer.liquidity - offer.amount;
    if (newOffererBalance < 0) {
      res.status(404).json({ msg: "Not enought balance" });
      return;
    }
    await UserModel.findByIdAndUpdate(offer.offerer, {
      liquidity: newOffererBalance,
    });

    await PropertieModel.findByIdAndUpdate(
      offer.property,
      { owner: offer.offerer },
      { new: true }
    );

    const owner = await UserModel.findById(offer.owner);
    if (owner === undefined || owner === null) {
      res.status(404).json({ msg: "Owner not found" });
      return;
    }
    const newOwnerBalance = owner.liquidity + offer.amount;
    await UserModel.findByIdAndUpdate(offer.owner, {
      liquidity: newOwnerBalance,
    });
    const propId = offer.property;
    await OfferModel.deleteMany({ property: offer.property });

    res.status(201).json({ id: id });
    //collectPropertyPurchaseInfo(offer.property)
  } catch (error: any) {
    res.status(500).json({ msg: error.message });
  }
};

//const deleteOffer
// acceptOffer?? / declineOffer?? --> Pueden ser simplemente eliminadas y estos eventos gestionarlos solo en Frontend

export {
  getOffererOffers,
  getOwnerOffers,
  createOffer,
  deleteOffer,
  execOffer,
};
