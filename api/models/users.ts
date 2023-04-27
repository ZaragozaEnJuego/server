import mongoose, { Model, Schema } from "mongoose";

interface User {
  name: string;
  _id?: string;
  icon?: string;
  liquidity: number;
  mail: string;
  created: Date;
  access: boolean;
  admin: boolean;
}

const userSchema = new Schema<User>({
  name: { type: String, required: true },
  liquidity: { type: Number, required: true },
  mail: { type: String, required: true },
  created: { type: Date, default: Date.now },
  admin: { type: Boolean, required: true },
});

const UserModel: Model<User> =
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  mongoose.models.User || mongoose.model("User", userSchema);

export default UserModel;
