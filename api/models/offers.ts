/*  Sistemas y Tecnologías Web - Fabra Caro, Francisco
*   Proyecto:                    Zaragoza en Juego 
*   Fichero:                     offers.ts
*   Desarrolladores:             Aréjula Aísa, Íñigo                  - 785370              
*                                González Martínez de Apellániz, Ibón - 756878
*                                Ruiz Borao, Juan José                - 756640
*                                Penacho, Ismael                      - 774572
*/

import mongoose, { Model, Schema } from "mongoose";

interface Offer {
    _id?: string;
    property: string;
    offerer: string;
    owner: string;
    amount: number;
}

const offerSchema = new Schema<Offer>({
    property: { type: String, required: true },
    offerer: { type: String, required: true },
    owner: { type: String, required: true },
    amount: { type: Number, required: true },
});

const OfferModel: Model<Offer> =
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    mongoose.models.Offer || mongoose.model("Offers", offerSchema);

export default OfferModel;
