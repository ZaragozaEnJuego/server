/*  Sistemas y Tecnologías Web - Fabra Caro, Francisco
*   Proyecto:                    Zaragoza en Juego 
*   Fichero:                     users.ts
*   Desarrolladores:             Aréjula Aísa, Íñigo                  - 785370              
*                                González Martínez de Apellániz, Ibón - 756878
*                                Ruiz Borao, Juan José                - 756640
*                                Penacho, Ismael                      - 774572
*/

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
  access: { type: Boolean, default: true, required: true},
  admin: { type: Boolean, required: true },
});

const UserModel: Model<User> =
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  mongoose.models.User || mongoose.model("User", userSchema);

export default UserModel;
