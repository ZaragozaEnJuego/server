/*  Sistemas y Tecnologías Web - Fabra Caro, Francisco
*   Proyecto:                    Zaragoza en Juego 
*   Fichero:                     statsAdmin.ts
*   Desarrolladores:             Aréjula Aísa, Íñigo                  - 785370              
*                                González Martínez de Apellániz, Ibón - 756878
*                                Ruiz Borao, Juan José                - 756640
*                                Penacho, Ismael                      - 774572
*/

import mongoose, { Model, Schema } from "mongoose";
import { Kind } from "./kindRules";

export interface PropertyPurchaseData {
    property: string,
    kind: Kind,
    date: Date
  }
  
  const propertyPurchaseDataSchema = new Schema<PropertyPurchaseData>({
    property: { type: String, required: true },
    kind: { type: String, required: true},
    date: { type: Date, required: true }
  })
  
  const PropertyPurchaseDataModel: Model<PropertyPurchaseData> = 
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    mongoose.models.PropertyPurchaseData ||
    mongoose.model("PropertyPurchaseData", propertyPurchaseDataSchema);
  
  export default PropertyPurchaseDataModel;