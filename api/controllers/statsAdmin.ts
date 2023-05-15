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
    try {
        const kind = req.params.kind
        if (typeof kind !== 'string') {
            return res.status(400).json({ msg: 'La propiedad "kind" debe ser una cadena de caracteres' })
        }
        const list = await PropertieModel.find({ kind })
        if (list === undefined || list.length === 0) {
            return res.status(404).json({ msg: `No se encontraron propiedades con el tipo "${kind}"` })
        }
        res.status(200).json(list)
    } catch (error: any) {
        console.error(error)
        res.status(500).json({ msg: 'Error interno del servidor' })
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
