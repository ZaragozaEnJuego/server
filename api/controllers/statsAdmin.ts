import { Request, Response } from "express";
import PropertyPurchaseDataModel, { PropertyPurchaseData } from "../models/statsAdmin";
import { Kind } from "../models/kindRules";
import PropertieModel from "../models/properties";

async function propertyPurchases(req: Request, res: Response) {
    //TODO: Implementar este servicio
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

async function collectPropertyPurchaseInfo(req: Request, res: Response) {
    interface IBody {
        property: string,
        kind: Kind,
        date: Date
    }
    const body: IBody = req.body
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
