import mongoose from "mongoose"
import Offer from "../models/offers"
import { Request, Response } from "express"

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
 *        404:
 *           description: Offer not found
 *        500:
 *           description: Some server error
 */
const getOffererOffers = (req: Request, res: Response) => {
    Offer.find({ offerer: req.body.offerer })
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
 *        404:
 *           description: Offer not found
 *        500:
 *           description: Some server error
 */
const getOwnerOffers = (req: Request, res: Response) => {
  Offer.find({ owner: req.body.owner })
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
 *           description: Error trying to create an offer
 */
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
 *          name: property
 *          schema:
 *             type: string
 *          required: true
 *          description: The id of the property which was offered
 *       - in: path 
 *          name: owner
 *          schema:
 *             type: string
 *          required: true
 *          description: The property owner id
 *       - in: path 
 *          name: offerer
 *          schema:
 *             type: string
 *          required: true
 *          description: The property offerer id
 *        - in: path
 *          name: amount
 *          schema:
 *             type: number
 *          required: true
 *          description: The amount of money in exchange
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
const execOffer = (req: Request, res: Response) => {
  //TODO: Definir lógica del servicio
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
const deleteOffer = (req: Request, res: Response) => {
  //TODO: Definir lógica del servicio
}

export { getOffererOffers, getOwnerOffers, getOffer, createOffer, execOffer, deleteOffer }

