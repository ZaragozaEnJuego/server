import { Request, Response } from "express";
import PropertyPurchaseDataModel, { PropertyPurchaseData } from "../models/statsAdmin";
import { Kind } from "../models/kindRules";
import PropertieModel from "../models/properties";

async function propertyPurchases(req: Request, res: Response) {
    try {
        const list = await PropertyPurchaseDataModel.find()
        res.status(200).json(list)
    } catch (error: any) {
        res.status(500).json({ msg: error.message})
    } 
}

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
    const propertie = await PropertieModel.findById(property)
    if (propertie !== null) {
        const kind = propertie.kind
        await PropertyPurchaseDataModel.create({
            property: property,
            kind: kind,
            date: new Date()
        })
    }
}

export { propertyPurchases, getPropertiesByKind, collectPropertyPurchaseInfo }
