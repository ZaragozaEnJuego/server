import mongoose, { Model, Schema } from "mongoose";
import { Kind } from "./kindRules";

interface Propertie {
  name: string;
  _id?: string;
  address: string;
  price: number;
  baseIncome: number;
  owner?: string;
  kind: Kind;
  lat: number;
  lng: number;
}

const propertieSchema = new Schema<Propertie>({
  name: { type: String, required: true },
  address: { type: String, required: true },
  price: { type: Number, required: true },
  baseIncome: { type: Number, required: true },
  owner: { type: String, required: false },
  kind: { type: String, required: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
});

const PropertieModel: Model<Propertie> =
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  mongoose.models.Propertie || mongoose.model("Propertie", propertieSchema);

export default PropertieModel;
