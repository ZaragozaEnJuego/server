import mongoose, { Model, Schema } from "mongoose";
import Propertie from "../models/properties";

interface User {
    name: string;
    _id?: string;
    icon?: string;
    liquidity: number;
    mail: string;
    access: boolean;
    admin: boolean;
}

const userSchema = new Schema<User>({
    name: { type: String, required: true },
    liquidity: { type: Number, required: true },
    mail: { type: String, required: true },
    admin: { type: Boolean, required: true },
});

const UserModel: Model<User> =
    mongoose.models.User || mongoose.model("User", userSchema);

export default UserModel;
