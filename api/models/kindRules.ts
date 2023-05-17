/*  Sistemas y Tecnologías Web - Fabra Caro, Francisco
*   Proyecto:                    Zaragoza en Juego 
*   Fichero:                     kindRules.ts
*   Desarrolladores:             Aréjula Aísa, Íñigo                  - 785370              
*                                González Martínez de Apellániz, Ibón - 756878
*                                Ruiz Borao, Juan José                - 756640
*                                Penacho, Ismael                      - 774572
*/

import mongoose, { Schema, Model } from "mongoose";

export type Kind = "transport" | "education" | "health" | "groceries";
interface KindRules {
  kind: Kind;
  MaxTemperature: { value: number; modifier: number };
  MinTemperature: { value: number; modifier: number };
  EnergyConsumption: number;
  Weather: { sunny: number; rainy: number; cloudy: number };
}
const KindRulesSchema = new Schema<KindRules>({
  kind: { type: String, required: true },
  MaxTemperature: {
    value: { type: Number, required: true },
    modifier: { type: Number, required: true },
  },
  MinTemperature: {
    value: { type: Number, required: true },
    modifier: { type: Number, required: true },
  },
  EnergyConsumption: { type: Number, required: true },
  Weather: {
    sunny: { type: Number, required: true },
    rainy: { type: Number, required: true },
    cloudy: { type: Number, required: true },
  },
});

const KindRulesModel: Model<KindRules> =
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  mongoose.models.KindRules || mongoose.model("KindRules", KindRulesSchema);

export default KindRulesModel;
