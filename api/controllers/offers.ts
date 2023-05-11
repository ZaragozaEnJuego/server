import mongoose from "mongoose"
import Offer from "../models/offers"
import { Request, Response } from "express"
import OfferModel from "../models/offers"
import UserModel from "../models/users"
import PropertieModel from "../models/properties"

/**
 * @swagger
 * tags:
 *    name: Offers
 *    description: The offers managing API
 * /negotiation/{id}:/offerer:
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
 *        500:
 *           description: Some server error
 */
const getOffererOffers = async (req: Request, res: Response) => {
    await OfferModel.find({ offerer: req.body.offerer })
    .then((offer) => offer == null ? res.status(404).json({ message: "Offer not found" }) : res.status(200).json(offer))
    .catch((err) => res.status(500).json(err))
}

/**
 * @swagger
 * tags:
 *    name: Offers
 *    description: The offers managing API
 * /negotiation/{id}:/owner:
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
 *        500:
 *           description: Some server error
 */
const getOwnerOffers = async (req: Request, res: Response) => {
  await OfferModel.find({ owner: req.body.owner })
  .then((offer) => offer == null ? res.status(404).json({ message: "Offer not found" }) : res.status(200).json(offer))
  .catch((err) => res.status(500).json(err))
}

/**
 * @swagger
 * tags:
 *    name: Offers
 *    description: The offers managing API
 * /negotiation/{id}::
 *    get:
 *      summary: Return the offer with a specific id
 *      tags: [Offers]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *             type: string
 *          required: true
 *          description: The offer id
 *      responses:
 *        200:
 *          description: The offer with the specific id
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
 *        404:
 *           description: Offer not found
 *        500:
 *           description: Some server error
 */
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
}

/**
 * @swagger
 * tags:
 *    name: Offers
 *    description: The offers managing API
 * /negotiation:
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
 *           description: Lack of parameters
 *        500:
 *           description: Some server error
 */
const createOffer = async (req: Request, res: Response) => {
  interface IBody {
    property: string,
    offerer: string,
    owner: string,
    amount: number
  }
  const body: IBody = req.body

  if (body.property === null) {
    res.status(400).json({ msg: "Required property id" })
    return
  }

  if (body.offerer === null) {
    res.status(400).json({ msg: "Required offerer id" })
    return
  }

  if (body.owner === null) {
    res.status(400).json({ msg: "Required owner id" })
    return
  }

  if (body.amount === null) {
    res.status(400).json({ msg: "Required amount of money" })
    return
  }

  await OfferModel.create({
    property: body.property,
    offerer: body.offerer,
    owner: body.owner,
    amount: body.amount
  })
  .then((offer) => {
    res.status(201).json(offer);
  })
  .catch((err) => {
    res.status(500).json(err);
  });
}

/**
 * @swagger
 * tags:
 *    name: Offers
 *    description: The offers managing API
 * /negotiation/{id}:/execute:
 *    post:
 *      summary: Execute an accepted offer
 *      tags: [Offers]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *             type: string
 *          required: true
 *          description: The id of the offer to execute
 *      responses:
 *        201:
 *          description: The offer is successfully executed
 *          content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    _id:
 *                      type: string
 *                      description: The executed offer id
 *                      nullable: true
 *                    property:
 *                      type: string
 *                      description: The id of transfered property
 *                    offerer:
 *                      type: string
 *                      description: The id of offerer who earns the property
 *                    owner:
 *                      type: string
 *                      description: The id of owner who receive the money
 *                    amount:
 *                      type: number
 *                      description: The involved amount of money in the offer
 *        400:
 *           description: Lack of parameters
 *           content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *       404:
 *         description: Offer not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Server error message
 */
const execOffer = async (req: Request, res: Response) => {
  const id = req.params.id;
  if (id === undefined || !mongoose.isObjectIdOrHexString(id)) {
    res.status(400).json({ msg: "No id provided" })
    return
  }

  try {
    const offer = await OfferModel.findById(id)
    if (offer === null) {
      res.status(404).json({ msg: "The offer does not exist" })
      return
    }
    
    const offerer = await UserModel.findById(offer.offerer)
    if (offerer === null) {
      res.status(404).json({ msg: "Offerer not found" })
      return
    }
    const newOffererBalance = offerer.liquidity - offer.amount
    await UserModel.findByIdAndUpdate(offer.offerer,
      { liquidity: newOffererBalance })
  
    await PropertieModel.findByIdAndUpdate(offer.property,
      { owner: offer.offerer },
      { new: true }
    )
  
    const owner = await UserModel.findById(offer.owner)
    if (owner === null) {
      res.status(404).json({ msg: "Owner not found" })
      return
    }
    const newOwnerBalance = owner.liquidity + offer.amount
    await UserModel.findByIdAndUpdate(offer.owner,{ liquidity: newOwnerBalance })
    res.status(201).json({ id: id })
  } catch (error: any) {
    res.status(500).json({ msg: error.message });
  }

}

/**
 * @swagger
 * tags:
 *    name: Offers
 *    description: The offers managing API
 * /negotiation/{id}:/delete:
 *    post:
 *      summary: Delete an existing offer
 *      tags: [Offers]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *             type: string
 *          required: true
 *          description: The id offered which is going to be deleted
 *      responses:
 *        201:
 *          description: The offer is successfully deleted
 *          content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    message:
 *                      type: string
 *                      description: Offer successfully deleted
 *       404:
 *         description: Offer not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Server error message
 */
const deleteOffer = async (req: Request, res: Response) => {
  //TODO: Definir lógica del servicio
}

export { getOffererOffers, getOwnerOffers, getOffer, createOffer, execOffer, deleteOffer }

