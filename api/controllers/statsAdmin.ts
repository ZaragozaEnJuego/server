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
 *  name: Purchases
 *  description: The purchases managing API
 * /purchases/kind::
 *   get:
 *      summary: List all properties filtered by kind
 *      tags: [Purchases]
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

const collectPropertyPurchaseInfo = async (property: string) => {
    try {
        const propertie = await PropertieModel.findById(property)
        if (propertie === null) {
            return
        }
        const kind = propertie.kind
        await PropertyPurchaseDataModel.create({
            property: property,
            kind: kind,
            date: new Date()
        })
    } catch (error: any) {
    }
}

export { propertyPurchases, getPropertiesByKind, collectPropertyPurchaseInfo }
