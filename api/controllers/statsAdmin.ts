import { Request, Response } from "express";
import PropertyPurchaseDataModel, { PropertyPurchaseData } from "../models/statsAdmin";
import { Kind } from "../models/kindRules";
import PropertieModel from "../models/properties";

/**
 * @swagger
 * tags:
 *  name: Purchases
 *  description: The purchases managing API
 * /purchases:
 *   get:
 *      summary: List all purchases by kind and date
 *      tags: [Purchases]
 *      responses:
 *          200:
 *            description: The list of purchases
 *            content:
 *               application/json:
 *                   schema:
 *                      type: array
 *                        items:
 *                          type: object
 *                          properties:
 *                             property:
 *                                 type: string
 *                                 description: The id of the purchased property 
 *                             kind:
 *                                 type: string
 *                                 description: The kind of the purchased property
 *                             date:
 *                                 type: date
 *                                 description: The date when the property was purchased
 *          500:
 *            description: Some server error                                 
 */
async function propertyPurchases(req: Request, res: Response) {
    try {
        const list = await PropertyPurchaseDataModel.find()
        res.status(200).json(list)
    } catch (error: any) {
        res.status(500).json({ msg: error.message})
    } 
}

/**
 * @swagger
 * tags:
 *  name: Properties
 *  description: The properties managing API
 * /properties:
 *   get:
 *      summary: List all properties filtered by kind
 *      tags: [Properties]
 *      parameters:
 *       - in: path
 *         name: kind
 *         schema:
 *           type: Kind
 *         required: true
 *         description: The kind of propertiy for filter
 *      responses:
 *          200:
 *            description: The list of properties 
 *            content:
 *               application/json:
 *                   schema:
 *                      type: array
 *                        items:
 *                          type: object
 *                          properties:
 *                             _id:
 *                                type: string
 *                                description: The auto-generated id of the propertie
 *                                nullable: true
 *                             name:
 *                                type: string
 *                             address:
 *                                type: string
 *                             price:
 *                                type: number
 *                             baseIncome:
 *                                type: number
 *                             owner:
 *                                type: string
 *                             kind:
 *                                type: string
 *          500:
 *            description: Some server error                                 
 */
async function getPropertiesByKind(req: Request, res: Response) {
    interface IBody {
        kind: Kind
    }
    const body: IBody = req.body
    try {
        const list = await PropertieModel.find({ kind: body.kind })
        res.status(200).json(list)
    } catch (error: any) {
        res.status(500).json({ msg: error.message })
    }
}

/**
 * @swagger
 * tags:
 *  name: Purchases
 *  description: The purchases managing API
 * /purchases:
 *   post:
 *      summary: Record a new purchase
 *      tags: [Purchases]
 *      parameters:
 *        - in: path
 *             name: property
 *             required: true
 *             schema:
 *               type: string
 *             description: The id of the purchased property 
 *        - in: path
 *             name: kind
 *             required: true
 *             schema:
 *               type: Kind
 *             description: The kind of the purchased property
 *        - in: path
 *             name: date
 *             required: true
 *             schema:
 *               type: Date
 *             description: The date when the property was purchased
 *      responses:
 *          201:
 *            description: Purchase successfully recorded
 *            content:
 *               application/json:
 *                   schema:
 *                      type: object
 *                      properties:
 *                          property:
 *                             type: string
 *                             description: The id of the purchased property 
 *                          kind:
 *                             type: string
 *                             description: The kind of the purchased property
 *                          date:
 *                             type: date
 *                             description: The date when the property was purchased
 *          400:
 *            description: Lack of parameters
 *            content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    description: Error message
 *          500:
 *            description: Some server error                                 
 */
async function collectPropertyPurchaseInfo(req: Request, res: Response) {
    interface IBody {
        property: string,
        kind: Kind,
        date: Date
    }
    const body: IBody = req.body

    if (body.property === undefined) {
        res.status(400).json({ msg: "Error: property id is required" })
        return
    }

    if (body.kind === undefined) {
        res.status(400).json({ msg: "Error: property kind is required" })
        return
    }

    if (body.date === undefined) {
        res.status(400).json({ msg: "Error: date of purchase is required" })
        return
    }

    try {
        const savedPurchaseData = await PropertyPurchaseDataModel.create({
            property: body.property,
            kind: body.kind,
            date: body.date
        })
        res.status(201).json({ property: body.property })
    } catch (error: any) {
        res.status(500).json({ msg: error.message })
    }

}

export { propertyPurchases, getPropertiesByKind, collectPropertyPurchaseInfo }
