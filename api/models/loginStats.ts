import mongoose, { Model, Schema } from "mongoose";

export interface LoginStat {
    user: string;
    date: Date;
}

const LoginstatSchema = new Schema<LoginStat>({
    user: { type: String, required: true },
    date: { type: Date, required: true, default: Date.now },
});

const LoginStatModel: Model<LoginStat> =
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    mongoose.models.LoginStat || mongoose.model("LoginStat", LoginstatSchema);

export default LoginStatModel;
