import mongoose from "mongoose";
import Offer from "../models/offers";
import { Request, Response } from "express";
import PropertieModel from "../models/properties";
import OfferModel from "../models/offers";

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
    //check propertie id was provided
    if (id === undefined) {
        res.status(404).json({
            message: "Not found, offerer id is required",
        });
        return;
    }
    try {
        const offers = await Offer.find({ offerer: id });
        res.status(200).json(offers);
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
    //check propertie id was provided
    if (id === undefined) {
        res.status(404).json({
            message: "Not found, owner id is required",
        });
        return;
    }
    try {
        const offers = await Offer.find({ owner: id });
        res.status(200).json(offers);
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

//const deleteOffer
// acceptOffer?? / declineOffer?? --> Pueden ser simplemente eliminadas y estos eventos gestionarlos solo en Frontend

export { getOffererOffers, getOwnerOffers, createOffer, deleteOffer };
