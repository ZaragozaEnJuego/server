/*  Sistemas y Tecnologías Web - Fabra Caro, Francisco
*   Proyecto:                    Zaragoza en Juego 
*   Fichero:                     loginStats.ts
*   Desarrolladores:             Aréjula Aísa, Íñigo                  - 785370              
*                                González Martínez de Apellániz, Ibón - 756878
*                                Ruiz Borao, Juan José                - 756640
*                                Penacho, Ismael                      - 774572
*/

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
