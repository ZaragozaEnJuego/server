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
  mongoose.models.KindRules || mongoose.model("KindRules", KindRulesSchema);

export default KindRulesModel;
