import mongoose, { Model, Schema } from "mongoose";

export type Kind = "Transport" | "Education" | "Health" | "Groceries";
function isKind(s: string): s is Kind {
    return (
        s === "Transport" ||
        s === "Education" ||
        s === "Health" ||
        s === "Groceries"
    );
}
interface Propertie {
    name: string;
    _id?: string;
    address: string;
    price: number;
    income: number;
    owner?: string;
    kind: Kind;
}

interface KindRestrictions {
    kind: Kind;
    MaxTemperature: { value: number; modifier: number };
    MinTemperature: { value: number; modifier: number };
    EnergyConsumption: number;
    Weather: { sunny: number; rainy: number; cloudy: number };
}

const propertieSchema = new Schema<Propertie>({
    name: { type: String, required: true },
    address: { type: String, required: true },
    price: { type: Number, required: true },
    income: { type: Number, required: true },
    owner: { type: String, required: false },
    kind: { type: String, required: true },
});

const PropertieModel: Model<Propertie> =
    mongoose.models.Propertie || mongoose.model("Propertie", propertieSchema);

const KindRestrictionsModel: Model<KindRestrictions> =
    mongoose.models.KindRestrictions ||
    mongoose.model("KindRestrictions", propertieSchema);

export { KindRestrictionsModel, isKind };
export default PropertieModel;
