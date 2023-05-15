import { Request, Response } from "express";
import PropertyPurchaseDataModel from "../models/statsAdmin";
import PropertieModel from "../models/properties";

async function propertyPurchases(req: Request, res: Response) {
    try {
        const list = await PropertyPurchaseDataModel.find()
        if (list === undefined || list.length === 0) res.status(404).json("Not purchases found")
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

export { propertyPurchases, getPropertiesByKind }
