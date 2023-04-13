import mongoose, { Model, Schema } from "mongoose";
import Propertie from "../models/properties";

interface Patrimonio {
    properties: typeof Propertie[];
}

interface User {
    name: string;
    _id?: string;
    icon?: string;
    patrimonio: Patrimonio;
    liquidez: number;
    mail: string;
    access: boolean;
    admin: boolean;
}

const patrimonioSchema = new Schema<Patrimonio>({
    properties: { type: [Propertie.schema], required: true },
});

const userSchema = new Schema<User>({
    name: { type: String, required: true },
    patrimonio: { type: patrimonioSchema, required: false },
    liquidez: { type: Number, required: true },
    mail: { type: String, required: true},
    admin: { type: Boolean, required: true},
});

const UserModel: Model<User> =
    mongoose.models.User || mongoose.model("User", userSchema);

export default UserModel;