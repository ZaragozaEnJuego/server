import { Request, Response } from "express";
import { PropertyPurchaseData } from "../models/statsAdmin";

async function propertyPurchases(req: Request, res: Response) {
    //TODO: Implementar este servicio
}
async function getPropertiesByKind(req: Request, res: Response) {
    //TODO: Implementar este servicio
}

async function collectPropertyPurchaseInfo(req: Request, res: Response) {
    //TODO: Implementar este servicio
}

export { propertyPurchases, getPropertiesByKind, collectPropertyPurchaseInfo }
